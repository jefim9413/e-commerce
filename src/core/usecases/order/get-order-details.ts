import { OrderRepository } from '@/core/repositories/order-repository'
import { OrderNotFoundError } from '../errors/order-not-found-error'

interface GetOrderDetailsUseCaseRequest {
  orderId: string
}

export class GetOrderDetailsUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId }: GetOrderDetailsUseCaseRequest) {
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      throw new OrderNotFoundError()
    }
    return { order }
  }
}
