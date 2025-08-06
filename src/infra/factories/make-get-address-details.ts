import { PrismaAddressRepository } from '@/core/repositories/prisma/prisma-address-repository'
import { GetAddressDetailsUseCase } from '@/core/usecases/address/get-address-details'

export function makeGetAddressDetails() {
  const addressesRepository = new PrismaAddressRepository()
  return new GetAddressDetailsUseCase(addressesRepository)
}
