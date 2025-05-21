import { FastifyReply, FastifyRequest } from 'fastify'
import { CartIsEmptyError } from '@/core/usecases/errors/cart-is-empty-error'
import { ProductNotFoundError } from '@/core/usecases/errors/product-not-found-error'
import { makeCreateOrder } from '@/infra/factories/make-create-order'

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const createOrderUseCase = makeCreateOrder()
    const { order } = await createOrderUseCase.execute({ userId })

    return reply.status(201).send({ order })
  } catch (err) {
    if (err instanceof CartIsEmptyError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof ProductNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
