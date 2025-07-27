import { OrderRepository } from '@/core/repositories/order-repository'
import { OrderStatus } from '@prisma/client'
import { OrderNotFoundError } from '../errors/order-not-found-error'

interface UpdateOrderStatusUseCaseRequest {
  orderId: string
  status: OrderStatus
}

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId, status }: UpdateOrderStatusUseCaseRequest) {
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      throw new OrderNotFoundError()
    }

    await this.orderRepository.updateStatus(orderId, status)
  }
}
