import { PrismaCartsRepository } from '@/core/repositories/prisma/prisma-carts-repository'
import { ListCartUseCase } from '@/core/usecases/cart/list-cart'

export function makeListCart() {
  const cartsRepository = new PrismaCartsRepository()
  return new ListCartUseCase(cartsRepository)
}
