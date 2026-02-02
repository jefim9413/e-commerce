import { PrismaProductsRepository } from '@/core/repositories/prisma/prisma-products-repository'
import { ListProductsUseCase } from '@/core/usecases/product/list-products'

export function makeListProducts() {
  const productsRepository = new PrismaProductsRepository()
  const listProductsUseCase = new ListProductsUseCase(productsRepository)

  return listProductsUseCase
}
