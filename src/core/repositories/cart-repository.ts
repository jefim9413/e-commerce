import { Cart } from '@prisma/client'

export interface CreateCartDTO {
  userId: string
  productId: string
  quantity: number
}

export interface CartRepository {
  create(data: CreateCartDTO): Promise<Cart>
  findByUserAndProduct(userId: string, productId: string): Promise<Cart | null>
  save(cart: Cart): Promise<void>
  findManyByUser(userId: string): Promise<Cart[]>
  remove(cartItemId: string): Promise<void>
  clear(userId: string): Promise<void>
}
