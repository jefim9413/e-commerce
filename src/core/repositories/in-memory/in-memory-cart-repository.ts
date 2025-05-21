import {
  CartRepository,
  CreateCartDTO,
} from '@/core/repositories/cart-repository'
import { Cart } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryCartRepository implements CartRepository {
  public items: Cart[] = []

  async clear(userId: string): Promise<void> {
    this.items = this.items.filter((item) => item.userId !== userId)
  }

  async remove(cartItemId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== cartItemId)
  }

  async findManyByUser(userId: string): Promise<Cart[]> {
    return this.items.filter((item) => item.userId === userId)
  }

  async create(data: CreateCartDTO): Promise<Cart> {
    const cart: Cart = {
      id: randomUUID(),
      createdAt: new Date(),
      ...data,
    }

    this.items.push(cart)
    return cart
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<Cart | null> {
    return (
      this.items.find(
        (item) => item.userId === userId && item.productId === productId,
      ) ?? null
    )
  }

  async save(cart: Cart): Promise<void> {
    const index = this.items.findIndex((item) => item.id === cart.id)
    if (index >= 0) {
      this.items[index] = cart
    }
  }
}
