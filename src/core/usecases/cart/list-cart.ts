import { CartRepository } from '@/core/repositories/cart-repository'
import { Cart } from '@prisma/client'

interface ListCartUseCaseRequest {
  userId: string
}

interface ListCartUseCaseResponse {
  items: Cart[]
}

export class ListCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    userId,
  }: ListCartUseCaseRequest): Promise<ListCartUseCaseResponse> {
    const items = await this.cartRepository.findManyByUser(userId)
    return { items }
  }
}
