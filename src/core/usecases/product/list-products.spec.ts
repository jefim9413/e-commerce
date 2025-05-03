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

  it('should list all products', async () => {
    await productsRepository.create({
      name: 'Monitor 24"',
      description: 'Full HD 75Hz',
      price: new Decimal(599.99),
      stock: 10,
      imageUrl: null,
    })

    await productsRepository.create({
      name: 'Teclado Mecânico',
      description: 'Switch azul RGB',
      price: new Decimal(299.99),
      stock: 15,
      imageUrl: null,
    })

    const { products } = await listProductsUseCase.execute({})

    expect(products).toHaveLength(2)
  })

  it('should filter by name (search)', async () => {
    await productsRepository.create({
      name: 'Monitor Gamer',
      description: '144Hz',
      price: new Decimal(999.99),
      stock: 5,
      imageUrl: null,
    })

    await productsRepository.create({
      name: 'Teclado',
      description: 'Mecânico',
      price: new Decimal(200),
      stock: 8,
      imageUrl: null,
    })

    const { products } = await listProductsUseCase.execute({
      search: 'monitor',
    })

    expect(products).toHaveLength(1)
    expect(products[0].name).toContain('Monitor')
  })

  it('should filter by price range', async () => {
    await productsRepository.create({
      name: 'Produto 1',
      description: 'Desc 1',
      price: new Decimal(100),
      stock: 2,
      imageUrl: null,
    })

    await productsRepository.create({
      name: 'Produto 2',
      description: 'Desc 2',
      price: new Decimal(300),
      stock: 2,
      imageUrl: null,
    })

    const { products } = await listProductsUseCase.execute({
      minPrice: 150,
      maxPrice: 350,
    })

    expect(products).toHaveLength(1)
    expect(products[0].price.toNumber()).toBe(300)
  })

  it('should support pagination', async () => {
    for (let i = 1; i <= 25; i++) {
      await productsRepository.create({
        name: `Produto ${i}`,
        description: 'Qualquer',
        price: new Decimal(i * 10),
        stock: 5,
        imageUrl: null,
      })
    }

    const { products } = await listProductsUseCase.execute({
      page: 2,
      limit: 10,
    })

    expect(products).toHaveLength(10)
    expect(products[0].name).toBe('Produto 11')
  })
})
