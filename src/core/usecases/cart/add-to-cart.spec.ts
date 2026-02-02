import { describe, it, expect, beforeEach } from 'vitest'
import { AddToCartUseCase } from './add-to-cart'
import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { InMemoryCartRepository } from '@/core/repositories/in-memory/in-memory-cart-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Decimal } from '@prisma/client/runtime/library'

let productsRepository: InMemoryProductsRepository
let cartRepository: InMemoryCartRepository
let sut: AddToCartUseCase

describe('AddToCartUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    cartRepository = new InMemoryCartRepository()
    sut = new AddToCartUseCase(cartRepository, productsRepository)
  })

  it('should add a new product to the cart if it does not exist yet', async () => {
    const product = await productsRepository.create({
      name: 'Mouse Gamer',
      description: 'Mouse com RGB e 7200 DPI',
      price: new Decimal(150),
      stock: 20,
      imageUrl: null,
    })

    const { item } = await sut.execute({
      userId: 'user-1',
      productId: product.id,
      quantity: 2,
    })

    expect(item).toMatchObject({
      userId: 'user-1',
      productId: product.id,
      quantity: 2,
    })

    expect(item.id).toEqual(expect.any(String))
    expect(item.createdAt).toBeInstanceOf(Date)
  })

  it('should increase the quantity if the product is already in the cart', async () => {
    const product = await productsRepository.create({
      name: 'Teclado Mecânico',
      description: 'Switch azul, RGB',
      price: new Decimal(250),
      stock: 10,
      imageUrl: null,
    })

    await sut.execute({
      userId: 'user-2',
      productId: product.id,
      quantity: 1,
    })

    const { item } = await sut.execute({
      userId: 'user-2',
      productId: product.id,
      quantity: 3,
    })

    expect(item.quantity).toBe(4)
  })

  it('should throw ResourceNotFoundError if product does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-3',
        productId: 'non-existing-product',
        quantity: 1,
      }),
    ).rejects.toThrow(ResourceNotFoundError)
  })
})
