import { PrismaAddressRepository } from '@/core/repositories/prisma/prisma-address-repository'
import { ListUserAddressesUseCase } from '@/core/usecases/address/list-address'

export function makeListAddress() {
  const addressesRepository = new PrismaAddressRepository()
  return new ListUserAddressesUseCase(addressesRepository)
}
