import { PrismaProductsRepository } from '@/core/repositories/prisma/prisma-products-repository'
import { RemoveProductUseCase } from '@/core/usecases/product/remove-product'

export function makeRemoveProduct() {
  const productsRepository = new PrismaProductsRepository()
  const removeProductUseCase = new RemoveProductUseCase(productsRepository)

  return removeProductUseCase
}
