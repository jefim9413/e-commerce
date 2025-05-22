import { prisma } from '@/config/prisma/database'
import {
  OrderRepository,
  CreateOrderDTO,
} from '@/core/repositories/order-repository'
import { Order } from '@prisma/client'

export class PrismaOrdersRepository implements OrderRepository {
  async listByUser(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
    })

    return orders
  }

  async listAll(): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    })

    return orders
  }

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
