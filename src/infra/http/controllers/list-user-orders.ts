import { makeListUserOrders } from '@/infra/factories/make-list-user-order'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function listUserOrders(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub
  const isAdmin = request.user.role === 'ADMIN'

  const listUserOrdersUseCase = makeListUserOrders()
  const { orders } = await listUserOrdersUseCase.execute({ userId, isAdmin })

  return reply.status(200).send({ orders })
}
