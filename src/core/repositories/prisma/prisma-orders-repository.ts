import { prisma } from '@/config/prisma/database'
import {
  OrderRepository,
  CreateOrderDTO,
} from '@/core/repositories/order-repository'
import { Order, OrderItem, OrderStatus } from '@prisma/client'

export type OrderWithItems = Order & {
  items: OrderItem[]
}

export class PrismaOrdersRepository implements OrderRepository {
  async findById(id: string): Promise<OrderWithItems | null> {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    })
    return order as OrderWithItems | null
  }

  async listByUser(userId: string): Promise<OrderWithItems[]> {
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

  async listAll(): Promise<OrderWithItems[]> {
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

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
  }
}
