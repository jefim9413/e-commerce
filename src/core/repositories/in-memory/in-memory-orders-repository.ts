import { randomUUID } from 'crypto'
import { OrderRepository, CreateOrderDTO } from '../order-repository'
import { Decimal } from '@prisma/client/runtime/library'

interface Order extends CreateOrderDTO {
  id: string
  createdAt: Date
}

export class InMemoryOrderRepository implements OrderRepository {
  public orders: Order[] = []

  async create(data: CreateOrderDTO): Promise<Order> {
    const order: Order = {
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
