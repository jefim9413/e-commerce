import { describe, it, beforeEach, expect } from 'vitest'
import { CreateAddressUseCase } from './create-address'
import { InMemoryAddressRepository } from '@/core/repositories/in-memory/in-memory-address-repository'

let addressRepository: InMemoryAddressRepository
let sut: CreateAddressUseCase

describe('CreateAddressUseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new CreateAddressUseCase(addressRepository)
  })

  it('should create a new address', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      street: 'Rua das Flores',
      number: '123',
      city: 'Cidade Exemplo',
      state: 'SP',
      zipcode: '12345-678',
      complement: 'Apto 101',
    })

    expect(result.address).toBeTruthy()
    expect(result.address.id).toBeDefined()
    expect(result.address.userId).toBe('user-1')
    expect(result.address.street).toBe('Rua das Flores')
    expect(addressRepository.addresses).toHaveLength(1)
  })
})
