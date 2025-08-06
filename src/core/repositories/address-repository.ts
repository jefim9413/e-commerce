import { Address, Prisma } from '@prisma/client'

export interface AddressRepository {
  create(data: Prisma.AddressCreateManyInput): Promise<Address>
  listByUser(userId: string): Promise<Address[]>
  findById(id: string): Promise<Address | null>
  update(id: string, data: Prisma.AddressUpdateInput): Promise<Address>
  remove(id: string): Promise<void>
}
