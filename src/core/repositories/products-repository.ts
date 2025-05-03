import { Prisma, Product } from '@prisma/client'

export interface ListProductsParams {
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export interface ProductsRepository {
  create(data: Prisma.ProductCreateInput): Promise<Product>
  findById(id: string): Promise<Product | null>
  list(params: ListProductsParams): Promise<Product[]>
  remove(id: string): Promise<void>
  update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>
}
