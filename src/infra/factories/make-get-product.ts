import { PrismaProductsRepository } from '@/core/repositories/prisma/prisma-products-repository'
import { GetProductUseCase } from '@/core/usecases/product/get-product'

export function makeGetProduct() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new GetProductUseCase(productsRepository)

  return useCase
}
