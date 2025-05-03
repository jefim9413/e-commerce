import { ProductsRepository } from '@/core/repositories/products-repository'
import { Product } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetProductUseCaseRequest {
  productId: string
}

interface GetProductUseCaseResponse {
  product: Product
}

export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    return { product }
  }
}
