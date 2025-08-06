import { AddressRepository } from '@/core/repositories/address-repository'
import { AddressNotFoundError } from '../errors/address-not-found-error'

export class RemoveAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}
  async execute(id: string, userId: string) {
    const addressExists = await this.addressRepository.findById(id)
    if (!addressExists) {
      throw new AddressNotFoundError()
    }

    if (addressExists.userId !== userId) {
      throw new AddressNotFoundError()
    }

    await this.addressRepository.remove(id)
  }
}
