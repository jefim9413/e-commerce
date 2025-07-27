import { PrismaOrdersRepository } from '@/core/repositories/prisma/prisma-orders-repository'
import { UpdateOrderStatusUseCase } from '@/core/usecases/order/update-order-status'

export function makeUpdateOrderStatus() {
  const ordersRepository = new PrismaOrdersRepository()
  return new UpdateOrderStatusUseCase(ordersRepository)
}
