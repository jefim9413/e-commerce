import { makeListCart } from '@/infra/factories/make-list-cart'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function listCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const listCartUseCase = makeListCart()
  const { items } = await listCartUseCase.execute({ userId })

  return reply.status(200).send({ items })
}
