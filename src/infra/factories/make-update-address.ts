import { PrismaAddressRepository } from '@/core/repositories/prisma/prisma-address-repository'
import { UpdateAddressUseCase } from '@/core/usecases/address/update-address'

export function makeUpdateAddress() {
  const addressesRepository = new PrismaAddressRepository()
  return new UpdateAddressUseCase(addressesRepository)
}
