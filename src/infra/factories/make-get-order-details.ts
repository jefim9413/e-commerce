import { PrismaOrdersRepository } from '@/core/repositories/prisma/prisma-orders-repository'
import { GetOrderDetailsUseCase } from '@/core/usecases/order/get-order-details'

export function makeGetOrderDetails() {
  const ordersRepository = new PrismaOrdersRepository()
  return new GetOrderDetailsUseCase(ordersRepository)
}
