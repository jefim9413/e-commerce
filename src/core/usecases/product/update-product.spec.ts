import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateProductUseCase } from './update-product'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { Decimal } from '@prisma/client/runtime/library'

let productsRepository: InMemoryProductsRepository
let updateProductUseCase: UpdateProductUseCase

describe('Update Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    updateProductUseCase = new UpdateProductUseCase(productsRepository)
  })

  it('should update an existing product', async () => {
    const created = await productsRepository.create({
      name: 'Produto Antigo',
      description: 'Descrição antiga',
      price: new Decimal(100),
      stock: 5,
      imageUrl: 'https://example.com/old.jpg',
    })

    const { product } = await updateProductUseCase.execute({
      id: created.id,
      name: 'Produto Novo',
      price: new Decimal(199.99).toNumber(),
    })

    expect(product.name).toBe('Produto Novo')
    expect(product.price).toBe(new Decimal(199.99).toNumber())
    expect(product.description).toBe('Descrição antiga')
  })

  it('should throw error if product does not exist', async () => {
    await expect(() =>
      updateProductUseCase.execute({
        id: 'non-existent',
        name: 'Qualquer',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
