import { Prisma, Product } from '@prisma/client'

export interface ProductsRepository {
  create(data: Prisma.ProductCreateInput): Promise<Product>
  findById(id: string): Promise<Product | null>
  findAll(): Promise<Product[]>
  remove(id: string): Promise<void>
  update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>
}
