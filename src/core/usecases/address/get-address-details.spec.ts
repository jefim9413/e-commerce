import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAddressRepository } from '@/core/repositories/in-memory/in-memory-address-repository'
import { GetAddressDetailsUseCase } from './get-address-details'
import { AddressNotFoundError } from '../errors/address-not-found-error'

let addressRepository: InMemoryAddressRepository
let sut: GetAddressDetailsUseCase

describe('Get Address Details Use Case', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new GetAddressDetailsUseCase(addressRepository)
  })

  it('should return address details if it belongs to user', async () => {
    const created = await addressRepository.create({
      userId: 'user-1',
      street: 'Rua Teste',
      number: '123',
      city: 'Cidade',
      state: 'SP',
      zipcode: '12345-000',
      complement: 'Apto 1',
    })

    const result = await sut.execute({
      addressId: created.id,
      userId: 'user-1',
    })
    expect(result.address).toBeTruthy()
    expect(result.address.street).toBe('Rua Teste')
  })

  it('should throw if address does not exist', async () => {
    await expect(() =>
      sut.execute({ addressId: 'non-existent-id', userId: 'user-1' }),
    ).rejects.toThrowError(AddressNotFoundError)
  })

  it('should throw if address does not belong to user', async () => {
    const created = await addressRepository.create({
      userId: 'user-1',
      street: 'Rua Teste',
      number: '123',
      city: 'Cidade',
      state: 'SP',
      zipcode: '12345-000',
      complement: 'Apto 1',
    })

    await expect(() =>
      sut.execute({ addressId: created.id, userId: 'user-2' }),
    ).rejects.toThrowError(AddressNotFoundError)
  })
})
