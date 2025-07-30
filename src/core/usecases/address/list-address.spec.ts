import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAddressRepository } from '@/core/repositories/in-memory/in-memory-address-repository'
import { ListUserAddressesUseCase } from './list-address'

let addressRepository: InMemoryAddressRepository
let sut: ListUserAddressesUseCase

describe('ListUserAddressesUseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new ListUserAddressesUseCase(addressRepository)
  })

  it('should list all addresses of the user', async () => {
    await addressRepository.create({
      userId: 'user-1',
      street: 'Rua 1',
      number: '100',
      city: 'Cidade',
      state: 'SP',
      zipcode: '11111111',
      complement: 'Apt 1',
    })
    await addressRepository.create({
      userId: 'user-1',
      street: 'Rua 2',
      number: '200',
      city: 'Cidade',
      state: 'SP',
      zipcode: '22222222',
      complement: 'Casa',
    })
    await addressRepository.create({
      userId: 'user-2',
      street: 'Rua 3',
      number: '300',
      city: 'Cidade',
      state: 'SP',
      zipcode: '33333333',
      complement: '',
    })

    const { addresses } = await sut.execute({ userId: 'user-1' })

    expect(addresses).toHaveLength(2)
    expect(addresses.every((addr) => addr.userId === 'user-1')).toBe(true)
  })
})
