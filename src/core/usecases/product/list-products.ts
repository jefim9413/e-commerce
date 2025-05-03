import { ProductsRepository } from '@/core/repositories/products-repository'
import { Product } from '@prisma/client'

interface ListProductsUseCaseRequest {
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

interface ListProductsUseCaseResponse {
  products: Product[]
}

export class ListProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  }: ListProductsUseCaseRequest): Promise<ListProductsUseCaseResponse> {
    const products = await this.productsRepository.list({
      search,
      minPrice,
      maxPrice,
      page,
      limit,
    })

    return { products }
  }
}
