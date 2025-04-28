import { ProductsRepository } from '@/core/repositories/products-repository'
import { Product } from '@prisma/client'

interface ListProductsUseCaseResponse {
  products: Product[]
}

export class ListProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(): Promise<ListProductsUseCaseResponse> {
    const products = await this.productsRepository.findAll()
    return { products }
  }
}
