import { Order, OrderStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateOrderItemDTO {
  productId: string
  quantity: number
  price: Decimal
}

export interface CreateOrderDTO {
  userId: string
  total: Decimal
  items: CreateOrderItemDTO[]
}
export interface OrderWithItems extends Order {
  items: CreateOrderItemDTO[]
}

export interface OrderRepository {
  create(data: CreateOrderDTO): Promise<OrderWithItems>
  listByUser(userId: string): Promise<OrderWithItems[]>
  listAll(): Promise<OrderWithItems[]>
  findById(id: string): Promise<OrderWithItems | null>
  updateStatus(orderId: string, status: OrderStatus): Promise<void>
}
