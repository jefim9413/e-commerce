import { prisma } from '@/config/prisma/database'
import { CartRepository, CreateCartDTO } from '../cart-repository'
import { Cart } from '@prisma/client'

export class PrismaCartsRepository implements CartRepository {
  async remove(cartItemId: string): Promise<void> {
    await prisma.cart.delete({
      where: {
        id: cartItemId,
      },
    })
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<Cart | null> {
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
      },
    })

    return cart
  }

  async create(data: CreateCartDTO): Promise<Cart> {
    const cart = await prisma.cart.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
      },
    })

    return cart
  }

  async findManyByUser(userId: string): Promise<Cart[]> {
    const carts = await prisma.cart.findMany({
      where: {
        userId,
      },
    })

    return carts
  }

  async save(cart: Cart): Promise<void> {
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        userId: cart.userId,
        productId: cart.productId,
        quantity: cart.quantity,
      },
    })
  }
}
