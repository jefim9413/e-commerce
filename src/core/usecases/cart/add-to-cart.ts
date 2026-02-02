import { CartRepository } from '@/core/repositories/cart-repository'
import { ProductsRepository } from '@/core/repositories/products-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface AddToCartUseCaseRequest {
  userId: string
  productId: string
  quantity: number
}

export class AddToCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({ userId, productId, quantity }: AddToCartUseCaseRequest) {
    const product = await this.productsRepository.findById(productId)
    if (!product) {
      throw new ResourceNotFoundError()
    }

    const existingItem = await this.cartRepository.findByUserAndProduct(
      userId,
      productId,
    )

    if (existingItem) {
      existingItem.quantity += quantity
      await this.cartRepository.save(existingItem)
      return { item: existingItem }
    }

    const item = await this.cartRepository.create({
      userId,
      productId,
      quantity,
    })

    return { item }
  }
}
