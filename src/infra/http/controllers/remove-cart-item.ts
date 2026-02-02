import { FastifyRequest, FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '@/core/usecases/errors/resource-not-found-error'
import { makeRemoveCartItem } from '@/infra/factories/make-remove-cart-item'

export async function removeCartItem(
  request: FastifyRequest<{ Params: { productId: string } }>,
  reply: FastifyReply,
) {
  const userId = request.user.sub
  const { productId } = request.params

  try {
    const removeCartItemUseCase = makeRemoveCartItem()
    await removeCartItemUseCase.execute({ userId, productId })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
