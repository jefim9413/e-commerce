import { AddressRepository } from '@/core/repositories/address-repository'
import { Address } from '@prisma/client'
import { AddressNotFoundError } from '../errors/address-not-found-error'

interface GetAddressDetailsUseCaseRequest {
  addressId: string
  userId: string
}
interface GetAddressDetailsResponse {
  address: Address
}
export class GetAddressDetailsUseCase {
  constructor(private addressRepository: AddressRepository) {}
  async execute({
    addressId,
    userId,
  }: GetAddressDetailsUseCaseRequest): Promise<GetAddressDetailsResponse> {
    const address = await this.addressRepository.findById(addressId)

    if (!address || address.userId !== userId) {
      throw new AddressNotFoundError()
    }
    return { address }
  }
}
