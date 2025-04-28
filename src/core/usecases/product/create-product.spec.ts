import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { CreateProductUseCase } from './create-product'

let productsRepository: InMemoryProductsRepository
let createProduct: CreateProductUseCase

describe('Create Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    createProduct = new CreateProductUseCase(productsRepository)
  })

  it('should be able to create a new product', async () => {
    const { product } = await createProduct.execute({
      name: 'Teclado Mecânico',
      description: 'Teclado RGB com switch red',
      price: 349.9,
      stock: 100,
      imageUrl: 'https://exemplo.com/teclado.jpg',
    })

    expect(product.id).toEqual(expect.any(String))
    expect(productsRepository.items).toHaveLength(1)
    expect(productsRepository.items[0].name).toBe('Teclado Mecânico')
  })
})
