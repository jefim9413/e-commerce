import { FastifyRequest, FastifyReply } from 'fastify'
import { makeUpdateOrderStatus } from '@/infra/factories/make-update-order-status'
import { OrderStatus } from '@prisma/client'
import { OrderNotFoundError } from '@/core/usecases/errors/order-not-found-error'

export async function updateOrderStatus(
  request: FastifyRequest<{
    Params: { orderId: string }
    Body: { status: OrderStatus }
  }>,
  reply: FastifyReply,
) {
  try {
    const { orderId } = request.params
    const { status } = request.body

    if (!Object.values(OrderStatus).includes(status)) {
      return reply.status(400).send({ message: 'Invalid order status' })
    }

    const updateOrderStatusUseCase = makeUpdateOrderStatus()
    await updateOrderStatusUseCase.execute({ orderId, status })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof OrderNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
