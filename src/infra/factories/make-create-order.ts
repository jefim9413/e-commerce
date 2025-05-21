import { PrismaCartsRepository } from '@/core/repositories/prisma/prisma-carts-repository'
import { PrismaOrdersRepository } from '@/core/repositories/prisma/prisma-orders-repository'
import { PrismaProductsRepository } from '@/core/repositories/prisma/prisma-products-repository'
import { CreateOrderUseCase } from '@/core/usecases/order/create-order'

export function makeCreateOrder() {
  const ordersRepository = new PrismaOrdersRepository()
  const productsRepository = new PrismaProductsRepository()
  const cartsRepository = new PrismaCartsRepository()

  const createOrderUseCase = new CreateOrderUseCase(
    ordersRepository,
    cartsRepository,
    productsRepository,
  )

  return createOrderUseCase
}
