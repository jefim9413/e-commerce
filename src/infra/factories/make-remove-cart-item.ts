import { PrismaCartsRepository } from '@/core/repositories/prisma/prisma-carts-repository'
import { RemoveCartItemUseCase } from '@/core/usecases/cart/remove-cart-item'

export function makeRemoveCartItem() {
  const cartRepository = new PrismaCartsRepository()
  return new RemoveCartItemUseCase(cartRepository)
}
