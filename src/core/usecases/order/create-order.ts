import { CartRepository } from '@/core/repositories/cart-repository'
import { ProductsRepository } from '@/core/repositories/products-repository'
import { OrderRepository } from '@/core/repositories/order-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ProductNotFoundError } from '../errors/product-not-found-error'
import { CartIsEmptyError } from '../errors/cart-is-empty-error'

interface CreateOrderUseCaseRequest {
  userId: string
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private cartRepository: CartRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({ userId }: CreateOrderUseCaseRequest) {
    const cartItems = await this.cartRepository.findManyByUser(userId)

    if (!cartItems.length) {
      throw new CartIsEmptyError()
    }

    const items = await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.productRepository.findById(item.productId)

        if (!product) {
          throw new ProductNotFoundError()
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price.toNumber(),
        }
      }),
    )

    const total = items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity
    }, 0)

    const order = await this.orderRepository.create({
      userId,
      total: new Decimal(total),
      items,
    })
    await this.cartRepository.clear(userId)

    return { order }
  }
}
