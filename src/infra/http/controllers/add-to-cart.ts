import { ProductsAlreadyExistsError } from '@/core/usecases/errors/products-already-exists-error'
import { AddToCartBodyDTO } from '@/core/validations/cart.schema'
import { makeAddToCart } from '@/infra/factories/make-add-to-cart'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function addToCart(
  request: FastifyRequest<{ Body: AddToCartBodyDTO }>,
  reply: FastifyReply,
) {
  const { quantity, productId } = request.body
  const id = request.user.sub
  try {
    const addToCartUseCase = makeAddToCart()
    const { item } = await addToCartUseCase.execute({
      userId: id,
      productId,
      quantity,
    })

    return reply.status(201).send({ item })
  } catch (err) {
    if (err instanceof ProductsAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
