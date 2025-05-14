import { PrismaCartsRepository } from '@/core/repositories/prisma/prisma-carts-repository'
import { PrismaProductsRepository } from '@/core/repositories/prisma/prisma-products-repository'
import { AddToCartUseCase } from '@/core/usecases/cart/add-to-cart'

export function makeAddToCart() {
  const cartRepository = new PrismaCartsRepository()
  const productsRepository = new PrismaProductsRepository()

  return new AddToCartUseCase(cartRepository, productsRepository)
}
