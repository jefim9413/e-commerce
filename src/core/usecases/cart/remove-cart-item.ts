import { CartRepository } from '@/core/repositories/cart-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface RemoveCartItemUseCaseRequest {
  userId: string
  productId: string
}

export class RemoveCartItemUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    userId,
    productId,
  }: RemoveCartItemUseCaseRequest): Promise<void> {
    const item = await this.cartRepository.findByUserAndProduct(
      userId,
      productId,
    )

    if (!item || item.userId !== userId) {
      throw new ResourceNotFoundError()
    }

    await this.cartRepository.remove(item.id)
  }
}
