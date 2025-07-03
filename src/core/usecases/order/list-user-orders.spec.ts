import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryOrderRepository } from '@/core/repositories/in-memory/in-memory-orders-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ListUserOrdersUseCase } from './list-user-orders'

let orderRepository: InMemoryOrderRepository
let sut: ListUserOrdersUseCase

describe('ListUserOrdersUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new ListUserOrdersUseCase(orderRepository)
  })

  it('should list all orders for a specific user', async () => {
    await orderRepository.create({
      userId: 'user-1',
      total: new Decimal(100),
      items: [
        {
          productId: 'prod-1',
          quantity: 2,
          price: new Decimal(50),
        },
      ],
    })

    await orderRepository.create({
      userId: 'user-1',
      total: new Decimal(200),
      items: [
        {
          productId: 'prod-2',
          quantity: 1,
          price: new Decimal(200),
        },
      ],
    })

    await orderRepository.create({
      userId: 'user-2',
      total: new Decimal(150),
      items: [
        {
          productId: 'prod-3',
          quantity: 3,
          price: new Decimal(50),
        },
      ],
    })

    const { orders } = await sut.execute({ userId: 'user-1' })

    expect(orders).toHaveLength(2)
    expect(orders.every((order) => order.userId === 'user-1')).toBe(true)
  })

  it('should return all orders if the user is an ADMIN', async () => {
    await orderRepository.create({
      userId: 'user-1',
      total: new Decimal(100),
      items: [
        {
          productId: 'prod-1',
          quantity: 2,
          price: new Decimal(50),
        },
      ],
    })

    await orderRepository.create({
      userId: 'user-2',
      total: new Decimal(200),
      items: [
        {
          productId: 'prod-2',
          quantity: 1,
          price: new Decimal(200),
        },
      ],
    })

    const { orders } = await sut.execute({
      userId: 'admin-user',
      isAdmin: true,
    })

    expect(orders).toHaveLength(2)
    expect(orders.some((order) => order.userId === 'user-1')).toBe(true)
    expect(orders.some((order) => order.userId === 'user-2')).toBe(true)
  })
})
