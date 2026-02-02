import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryOrderRepository } from '@/core/repositories/in-memory/in-memory-orders-repository'
import { UpdateOrderStatusUseCase } from './update-order-status'
import { OrderStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { OrderNotFoundError } from '../errors/order-not-found-error'

let orderRepository: InMemoryOrderRepository
let sut: UpdateOrderStatusUseCase

describe('UpdateOrderStatusUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new UpdateOrderStatusUseCase(orderRepository)
  })

  it('should update the status of an existing order', async () => {
    const createdOrder = await orderRepository.create({
      userId: 'user-1',
      total: new Decimal(300),
      addressId: 'address-1',
      items: [{ productId: 'prod-1', quantity: 2, price: new Decimal(150) }],
    })

    await sut.execute({
      orderId: createdOrder.id,
      status: OrderStatus.DELIVERED,
    })

    const updatedOrder = await orderRepository.findById(createdOrder.id)
    expect(updatedOrder?.status).toBe(OrderStatus.DELIVERED)
  })

  it('should throw OrderNotFoundError if order does not exist', async () => {
    await expect(() =>
      sut.execute({
        orderId: 'non-existent-id',
        status: OrderStatus.DELIVERED,
      }),
    ).rejects.toBeInstanceOf(OrderNotFoundError)
  })
})
