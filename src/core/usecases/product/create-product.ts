import { ProductsRepository } from '@/core/repositories/products-repository'
import { Product } from '@prisma/client'

interface CreateProductUsecaseRequest {
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
}
interface CreateProductUsecaseResponse {
  product: Product
}

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(
    productData: CreateProductUsecaseRequest,
  ): Promise<CreateProductUsecaseResponse> {
    const product = await this.productsRepository.create(productData)
    return { product }
  }
}
