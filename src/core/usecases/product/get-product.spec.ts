import { describe, it, expect, beforeEach } from 'vitest'
import { GetProductUseCase } from './get-product'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { Decimal } from '@prisma/client/runtime/library'

let productsRepository: InMemoryProductsRepository
let getProductUseCase: GetProductUseCase

describe('Get Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    getProductUseCase = new GetProductUseCase(productsRepository)
  })

  it('should be able to get a product by ID', async () => {
    const created = await productsRepository.create({
      name: 'Cadeira Gamer',
      description: 'Cadeira com encosto reclinável',
      price: new Decimal(299.99),
      stock: 12,
      imageUrl: 'https://example.com/cadeira.jpg',
    })

    const { product } = await getProductUseCase.execute({
      productId: created.id,
    })

    expect(product).toEqual(
      expect.objectContaining({
        id: created.id,
        name: 'Cadeira Gamer',
      }),
    )
  })

  it('should not be able to get a product with invalid ID', async () => {
    await expect(() =>
      getProductUseCase.execute({ productId: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
