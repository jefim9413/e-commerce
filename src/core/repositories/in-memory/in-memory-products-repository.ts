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
}
