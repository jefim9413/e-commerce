import { PrismaProductsRepository } from '@/core/repositories/prisma/prisma-products-repository'
import { UpdateProductUseCase } from '@/core/usecases/product/update-product'

export function makeUpdateProduct() {
  const productsRepository = new PrismaProductsRepository()
  return new UpdateProductUseCase(productsRepository)
}
