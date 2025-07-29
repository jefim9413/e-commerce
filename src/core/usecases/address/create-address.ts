import { AddressRepository } from '@/core/repositories/address-repository'
import { Address } from '@prisma/client'

interface CreateAddressUseCaseRequest {
  userId: string
  street: string
  number: string
  city: string
  state: string
  zipcode: string
  complement?: string
}

interface CreateAddressUseCaseResponse {
  address: Address
}

export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    userId,
    street,
    number,
    city,
    state,
    zipcode,
    complement,
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const address = await this.addressRepository.create({
      userId,
      street,
      number,
      city,
      state,
      zipcode,
      complement,
    })

    return { address }
  }
}
