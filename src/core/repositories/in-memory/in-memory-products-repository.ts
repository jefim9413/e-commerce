import { Product } from '@prisma/client'
import {
  ListProductsParams,
  ProductsRepository,
} from '@/core/repositories/products-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async save(product: Product): Promise<void> {
    const index = this.items.findIndex((p) => p.id === product.id)
    if (index !== -1) {
      this.items[index] = product
    }
  }

  async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      createdAt: new Date(),
      ...data,
      imageUrl: data.imageUrl ?? null,
      price: new Decimal(data.price),
    }

    this.items.push(product)
    return product
  }

  async findById(id: string): Promise<Product | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const index = this.items.findIndex((item) => item.id === id)

    if (index < 0) throw new Error('Product not found')

    const updated = {
      ...this.items[index],
      ...data,
      price: data.price ? new Decimal(data.price) : this.items[index].price,
    }

    this.items[index] = updated
    return updated
  }

  async remove(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index >= 0) this.items.splice(index, 1)
  }

  async list({
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  }: ListProductsParams): Promise<Product[]> {
    let result = [...this.items]

    if (search) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (minPrice !== undefined) {
      result = result.filter((item) => item.price.gte(minPrice))
    }

    if (maxPrice !== undefined) {
      result = result.filter((item) => item.price.lte(maxPrice))
    }

    const start = (page - 1) * limit
    const end = start + limit

    return result.slice(start, end)
  }
}
