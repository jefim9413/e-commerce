import { FastifyRequest, FastifyReply } from 'fastify'
import {
  UpdateProductDTO,
  updateProductSchema,
} from '@/core/validations/product.schema'
import { makeUpdateProduct } from '@/infra/factories/make-update-product'
import { ResourceNotFoundError } from '@/core/usecases/errors/resource-not-found-error'

export async function updateProduct(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateProductDTO }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params
    const data = updateProductSchema.parse(request.body)

    const updateProductUseCase = makeUpdateProduct()
    const { product } = await updateProductUseCase.execute({ id, ...data })

    return reply.status(200).send({ product })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
