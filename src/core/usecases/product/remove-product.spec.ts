import { describe, it, expect, beforeEach } from 'vitest'
import { RemoveProductUseCase } from './remove-product'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { Decimal } from '@prisma/client/runtime/library'

let productsRepository: InMemoryProductsRepository
let removeProductUseCase: RemoveProductUseCase

describe('Remove Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    removeProductUseCase = new RemoveProductUseCase(productsRepository)
  })

  it('should be able to remove an existing product', async () => {
    const product = await productsRepository.create({
      name: 'Notebook Gamer',
      description: 'Notebook top de linha',
      price: new Decimal(5000),
      stock: 5,
      imageUrl: 'https://example.com/notebook.jpg',
    })
    await removeProductUseCase.execute(product.id)

    expect(productsRepository.items).toHaveLength(0)
  })

  it('should not be able to remove a non-existing product', async () => {
    await expect(() =>
      removeProductUseCase.execute('non-existing-product-id'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
