import { randomUUID } from 'crypto'
import {
  OrderRepository,
  CreateOrderDTO,
  OrderWithItems,
} from '../order-repository'
import { Decimal } from '@prisma/client/runtime/library'

interface Order extends CreateOrderDTO {
  id: string
  createdAt: Date
}

export class InMemoryOrderRepository implements OrderRepository {
  public orders: OrderWithItems[] = []
  async findById(id: string): Promise<OrderWithItems | null> {
    const order = this.orders.find((order) => order.id === id)
    if (!order) {
      return null
    }
    return order
  }

  async create(data: CreateOrderDTO): Promise<OrderWithItems> {
    const order: OrderWithItems = {
      id: randomUUID(),
      userId: data.userId,
      total: new Decimal(data.total),
      items: data.items,
      createdAt: new Date(),
    }

    this.orders.push(order)
    return order
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orders.filter((order) => order.userId === userId)
  }

  async listByUser(userId: string): Promise<Order[]> {
    return this.orders.filter((order) => order.userId === userId)
  }

  async listAll(): Promise<Order[]> {
    return this.orders
  }
}
