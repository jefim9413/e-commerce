import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetProduct } from '@/infra/factories/make-get-product'
import { ResourceNotFoundError } from '@/core/usecases/errors/resource-not-found-error'

export async function getProduct(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params

  try {
    const getProductUseCase = makeGetProduct()
    const { product } = await getProductUseCase.execute({ productId: id })

    return reply.status(200).send({ product })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
