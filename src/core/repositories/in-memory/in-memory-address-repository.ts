import { AddressRepository } from '@/core/repositories/address-repository'
import { Address } from '@prisma/client'

function randomId() {
  return Math.random().toString(36).substring(2)
}

export class InMemoryAddressRepository implements AddressRepository {
  public addresses: Address[] = []

  async create(data: Omit<Address, 'id' | 'createdAt'>): Promise<Address> {
    const address: Address = {
      id: randomId(),
      createdAt: new Date(),
      ...data,
    }
    this.addresses.push(address)
    return address
  }

  async listByUser(userId: string): Promise<Address[]> {
    return this.addresses.filter((addr) => addr.userId === userId)
  }

  async findById(id: string): Promise<Address | null> {
    return this.addresses.find((addr) => addr.id === id) || null
  }
}
