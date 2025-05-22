import { PrismaOrdersRepository } from '@/core/repositories/prisma/prisma-orders-repository'
import { ListUserOrdersUseCase } from '@/core/usecases/order/list-user-orders'

export function makeListUserOrders() {
  const ordersRepository = new PrismaOrdersRepository()
  return new ListUserOrdersUseCase(ordersRepository)
}
