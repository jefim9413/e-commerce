import { ProductsRepository } from '@/core/repositories/products-repository'
import { Product } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      createdAt: new Date(),
      ...data,
    }

    this.items.push(product)
    return product
  }

  async findById(id: string): Promise<Product | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findAll(): Promise<Product[]> {
    return this.items
  }

  async remove(id: string): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === id)

    if (productIndex >= 0) {
      this.items.splice(productIndex, 1)
    }
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const productIndex = this.items.findIndex((item) => item.id === id)

    if (productIndex < 0) {
      throw new Error('Product not found')
    }

    const updatedProduct = { ...this.items[productIndex], ...data }
    this.items[productIndex] = updatedProduct

    return updatedProduct
  }
}
