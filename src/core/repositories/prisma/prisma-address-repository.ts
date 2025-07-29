import { prisma } from '@/config/prisma/database'
import { Address, Prisma } from '@prisma/client'
import { AddressRepository } from '../address-repository'

export class PrismaAddressRepository implements AddressRepository {
  async create(data: Prisma.AddressCreateManyInput): Promise<Address> {
    return prisma.address.create({ data })
  }

  async listByUser(userId: string): Promise<Address[]> {
    return prisma.address.findMany({ where: { userId } })
  }

  async findById(id: string): Promise<Address | null> {
    return prisma.address.findUnique({ where: { id } })
  }
}
