import { prisma } from '@/config/prisma/database'
import {
  OrderRepository,
  CreateOrderDTO,
} from '@/core/repositories/order-repository'

export class PrismaOrdersRepository implements OrderRepository {
  async create(data: CreateOrderDTO) {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
        items: {
          createMany: {
            data: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      },
      include: {
        items: true,
      },
    })
    return order
  }
}
