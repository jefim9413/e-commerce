import { Order } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateOrderItemDTO {
  productId: string
  quantity: number
  price: number
}

export interface CreateOrderDTO {
  userId: string
  total: Decimal
  items: CreateOrderItemDTO[]
}

export interface OrderRepository {
  create(data: CreateOrderDTO): Promise<Order>
}
