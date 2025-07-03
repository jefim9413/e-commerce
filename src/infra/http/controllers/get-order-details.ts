import { makeGetOrderDetails } from '@/infra/factories/make-get-order-details'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getOrderDetails(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const orderId = request.params.id

    const getOrderDetailsUseCase = makeGetOrderDetails()

    const { order } = await getOrderDetailsUseCase.execute({ orderId })

    return reply.status(200).send({ order })
  } catch (err) {
    console.error('Erro ao buscar detalhe do pedido:', err)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
