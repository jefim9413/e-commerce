import { PrismaAddressRepository } from '@/core/repositories/prisma/prisma-address-repository'
import { RemoveAddressUseCase } from '@/core/usecases/address/remove-address'

export function makeRemoveAddress() {
  const addressesRepository = new PrismaAddressRepository()
  return new RemoveAddressUseCase(addressesRepository)
}
