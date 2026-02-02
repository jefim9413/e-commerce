import { OrderRepository } from '@/core/repositories/order-repository'

interface ListUserOrdersUseCaseRequest {
  userId: string
  isAdmin?: boolean
}

export class ListUserOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ userId, isAdmin }: ListUserOrdersUseCaseRequest) {
    if (isAdmin) {
      const orders = await this.orderRepository.listAll()
      return { orders }
    }

    const orders = await this.orderRepository.listByUser(userId)

    return { orders }
  }
}
