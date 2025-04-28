import { ProductsAlreadyExistsError } from '@/core/usecases/errors/products-already-exists-error'
import { CreateProductDTO } from '@/core/validations/product.schema'
import { makeCreateProduct } from '@/infra/factories/make-create-product'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createProduct(
  request: FastifyRequest<{ Body: CreateProductDTO }>,
  reply: FastifyReply,
) {
  const { name, description, price, stock, imageUrl } = request.body
  try {
    const createProductUseCase = makeCreateProduct()
    const { product } = await createProductUseCase.execute({
      name,
      description,
      price,
      stock,
      imageUrl,
    })

    return reply.status(201).send({ product })
  } catch (err) {
    if (err instanceof ProductsAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
