import { PrismaAddressRepository } from '@/core/repositories/prisma/prisma-address-repository'
import { CreateAddressUseCase } from '@/core/usecases/address/create-address'

export function makeCreateAddress() {
  const addressesRepository = new PrismaAddressRepository()
  return new CreateAddressUseCase(addressesRepository)
}
