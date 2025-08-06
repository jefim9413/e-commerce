import { AddressRepository } from '@/core/repositories/address-repository'
import { AddressNotFoundError } from '../errors/address-not-found-error'
import { Address } from '@prisma/client'

interface UpdateAddressUseCaseRequest {
  street?: string
  number?: string
  city?: string
  state?: string
  zipcode?: string
  complement?: string
}

interface UpdateAddressUseCaseResponse {
  address: Address
}

export class UpdateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(
    addressId: string,
    userId: string,
    data: UpdateAddressUseCaseRequest,
  ): Promise<UpdateAddressUseCaseResponse> {
    const addressExists = await this.addressRepository.findById(addressId)
    if (!addressExists || addressExists.userId !== userId) {
      throw new AddressNotFoundError()
    }

    const address = await this.addressRepository.update(addressId, data)

    return { address }
  }
}
