import { AddressRepository } from '@/core/repositories/address-repository'
import { Address } from '@prisma/client'

interface ListUserAddressesUseCaseRequest {
  userId: string
}

interface ListUserAddressesUseCaseResponse {
  addresses: Address[]
}

export class ListUserAddressesUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    userId,
  }: ListUserAddressesUseCaseRequest): Promise<ListUserAddressesUseCaseResponse> {
    const addresses = await this.addressRepository.listByUser(userId)
    return { addresses }
  }
}
