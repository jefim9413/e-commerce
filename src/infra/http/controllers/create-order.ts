import { FastifyReply, FastifyRequest } from 'fastify'
import { CartIsEmptyError } from '@/core/usecases/errors/cart-is-empty-error'
import { ProductNotFoundError } from '@/core/usecases/errors/product-not-found-error'
import { makeCreateOrder } from '@/infra/factories/make-create-order'
import { AddressNotFoundError } from '@/core/usecases/errors/address-not-found-error'

export async function createOrder(
  request: FastifyRequest<{ Body: { addressId: string } }>,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const { addressId } = request.body
    const createOrderUseCase = makeCreateOrder()
    const { order } = await createOrderUseCase.execute({ userId, addressId })

    return reply.status(201).send({ order })
  } catch (err) {
    if (err instanceof AddressNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof CartIsEmptyError) {
      return reply.status(400).send({ message: err.message })
    }
    if (err instanceof ProductNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
