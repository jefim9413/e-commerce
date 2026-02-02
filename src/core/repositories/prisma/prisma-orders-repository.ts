import { prisma } from '@/config/prisma/database'
import {
  OrderRepository,
  CreateOrderDTO,
} from '@/core/repositories/order-repository'
import { Address, Order, OrderItem, OrderStatus } from '@prisma/client'

export type OrderWithItems = Order & {
  items: OrderItem[]
  address?: Address
}

export class PrismaOrdersRepository implements OrderRepository {
  async findById(id: string): Promise<OrderWithItems | null> {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
        Address: true,
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
        Address: true,
      },
    })

    return orders
  }

  async listAll(): Promise<OrderWithItems[]> {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        Address: true,
      },
    })

    return orders
  }

  async create(data: CreateOrderDTO) {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        addressId: data.addressId,
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
        Address: true,
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
