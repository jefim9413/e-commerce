import { PrismaProductsRepository } from '@/core/repositories/prisma/prisma-products-repository'
import { CreateProductUseCase } from '@/core/usecases/product/create-product'

export function makeCreateProduct() {
  const productsRepository = new PrismaProductsRepository()
  const createProductUseCase = new CreateProductUseCase(productsRepository)

  return createProductUseCase
}
