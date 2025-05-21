import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryCartRepository } from '@/core/repositories/in-memory/in-memory-cart-repository'
import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryOrderRepository } from '@/core/repositories/in-memory/in-memory-orders-repository'
import { CartIsEmptyError } from '../errors/cart-is-empty-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'
import { CreateOrderUseCase } from './create-order'

let cartRepository: InMemoryCartRepository
let productsRepository: InMemoryProductsRepository
let orderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    cartRepository = new InMemoryCartRepository()
    productsRepository = new InMemoryProductsRepository()
    orderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(
      orderRepository,
      cartRepository,
      productsRepository,
    )
  })

  it('should create an order with valid cart items', async () => {
    const userId = 'user-1'
    const product = await productsRepository.create({
      name: 'Produto Teste',
      description: 'Descrição',
      price: new Decimal(150),
      stock: 5,
      imageUrl: null,
    })

    await cartRepository.create({
      userId,
      productId: product.id,
      quantity: 2,
    })

    const { order } = await sut.execute({ userId })

    expect(order).toBeTruthy()
    expect(order.total).toBeInstanceOf(Decimal)
    expect(order.total.toNumber()).toBe(300)

    const savedOrder = orderRepository.orders.find((o) => o.id === order.id)
    expect(savedOrder).toBeTruthy()
    expect(savedOrder?.items).toHaveLength(1)
  })

  it('should throw CartIsEmptyError if cart is empty', async () => {
    await expect(() =>
      sut.execute({ userId: 'user-without-cart' }),
    ).rejects.toBeInstanceOf(CartIsEmptyError)
  })

  it('should throw ProductNotFoundError if any product in cart does not exist', async () => {
    const userId = 'user-2'

    await cartRepository.create({
      userId,
      productId: 'non-existent-product-id',
      quantity: 1,
    })

    await expect(() => sut.execute({ userId })).rejects.toBeInstanceOf(
      ProductNotFoundError,
    )
  })
})
