import { ResourceNotFoundError } from '@/core/usecases/errors/resource-not-found-error'
import { makeRemoveProduct } from '@/infra/factories/make-remove-product'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function removeProduct(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params

  try {
    const removeProductUseCase = makeRemoveProduct()
    const product = await removeProductUseCase.execute(id)

    return reply.status(200).send(product)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: 'Product not found',
      })
    }

    return reply.status(500).send({
      message: 'Internal server error',
    })
  }
}
