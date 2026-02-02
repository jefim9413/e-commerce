import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryOrderRepository } from '@/core/repositories/in-memory/in-memory-orders-repository'
import { OrderNotFoundError } from '../errors/order-not-found-error'
import { Decimal } from '@prisma/client/runtime/library'
import { GetOrderDetailsUseCase } from './get-order-details'

let orderRepository: InMemoryOrderRepository
let sut: GetOrderDetailsUseCase

describe('GetOrderDetailsUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new GetOrderDetailsUseCase(orderRepository)
  })

  it('should return order details if order exists', async () => {
    const createdOrder = await orderRepository.create({
      userId: 'user-1',
      total: new Decimal(250),
      addressId: 'address-1',
      items: [
        {
          productId: 'prod-1',
          quantity: 2,
          price: new Decimal(125),
        },
      ],
    })

    const result = await sut.execute({ orderId: createdOrder.id })

    expect(result.order).toBeTruthy()
    expect(result.order.id).toBe(createdOrder.id)
    expect(result.order.items).toHaveLength(1)
  })

  it('should throw OrderNotFoundError if order does not exist', async () => {
    await expect(() =>
      sut.execute({ orderId: 'non-existent-order-id' }),
    ).rejects.toBeInstanceOf(OrderNotFoundError)
  })
})
