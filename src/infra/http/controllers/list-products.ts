import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListProducts } from '@/infra/factories/make-list-products'

export async function listProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listProductsUseCase = makeListProducts()

  const { products } = await listProductsUseCase.execute()

  return reply.status(200).send({ products })
}
