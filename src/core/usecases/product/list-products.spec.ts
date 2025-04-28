import { describe, it, expect, beforeEach } from 'vitest'
import { ListProductsUseCase } from './list-products'
import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { Decimal } from '@prisma/client/runtime/library'

let productsRepository: InMemoryProductsRepository
let listProductsUseCase: ListProductsUseCase

describe('List Products Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    listProductsUseCase = new ListProductsUseCase(productsRepository)
  })

  it('should be able to list all products', async () => {
    await productsRepository.create({
      name: 'Produto 1',
      description: 'Descrição do Produto 1',
      price: new Decimal(100),
      stock: 10,
      imageUrl: 'https://example.com/produto1.jpg',
    })

    await productsRepository.create({
      name: 'Produto 2',
      description: 'Descrição do Produto 2',
      price: new Decimal(200),
      stock: 5,
      imageUrl: 'https://example.com/produto2.jpg',
    })

    const { products } = await listProductsUseCase.execute()

    expect(products).toHaveLength(2)
    expect(products).toEqual([
      expect.objectContaining({ name: 'Produto 1' }),
      expect.objectContaining({ name: 'Produto 2' }),
    ])
  })
})
