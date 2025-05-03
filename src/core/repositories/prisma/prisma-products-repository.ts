import { Prisma, Product } from '@prisma/client'
import { ListProductsParams, ProductsRepository } from '../products-repository'
import { prisma } from '@/config/prisma/database'

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    const product = await prisma.product.create({
      data,
    })
    return product
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })
    return product
  }

  async list({
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  }: ListProductsParams): Promise<Product[]> {
    const whereClause: Prisma.ProductWhereInput = {
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {}
      if (minPrice !== undefined) whereClause.price.gte = minPrice
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice
    }

    return await prisma.product.findMany({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async remove(id: string): Promise<void> {
    await prisma.product.delete({
      where: {
        id,
      },
    })
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data,
    })
    return product
  }
}
