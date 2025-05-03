import { FastifyRequest, FastifyReply } from 'fastify'
import { makeListProducts } from '@/infra/factories/make-list-products'

export async function listProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { search, minPrice, maxPrice, page, limit } = request.query as {
    search?: string
    minPrice?: string
    maxPrice?: string
    page?: string
    limit?: string
  }

  const listProductsUseCase = makeListProducts()

  const { products } = await listProductsUseCase.execute({
    search,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  })

  return reply.status(200).send({ products })
}
