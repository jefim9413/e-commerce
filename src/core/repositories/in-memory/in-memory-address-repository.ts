import { AddressRepository } from '@/core/repositories/address-repository'
import { Address, Prisma } from '@prisma/client'

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

  async update(id: string, data: Prisma.AddressUpdateInput): Promise<Address> {
    const index = this.addresses.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Address not found')
    this.addresses[index] = {
      ...this.addresses[index],
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === 'object' && value !== null && 'set' in value
            ? value.set
            : value,
        ]),
      ),
    }
    return this.addresses[index]
  }

  async remove(id: string): Promise<void> {
    const index = this.addresses.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Address not found')
    this.addresses.splice(index, 1)
  }
}
