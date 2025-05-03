import { ProductsRepository } from '@/core/repositories/products-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class RemoveProductUseCase {
  constructor(private productRepository: ProductsRepository) {}

  async execute(productId: string) {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new ResourceNotFoundError()
    }
    await this.productRepository.remove(productId)
    return product
  }
}
