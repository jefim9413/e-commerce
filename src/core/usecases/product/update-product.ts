import { ProductsRepository } from '@/core/repositories/products-repository'
import { Product } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateProductUseCaseRequest {
  id: string
  name?: string
  description?: string
  price?: number
  stock?: number
  imageUrl?: string | null
}

interface UpdateProductUseCaseResponse {
  product: Product
}

export class UpdateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    id,
    ...data
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    const updated = await this.productsRepository.update(id, data)

    return { product: updated }
  }
}
