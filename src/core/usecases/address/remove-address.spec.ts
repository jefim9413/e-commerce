import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAddressRepository } from '@/core/repositories/in-memory/in-memory-address-repository'
import { RemoveAddressUseCase } from './remove-address'
import { AddressNotFoundError } from '../errors/address-not-found-error'

let addressRepository: InMemoryAddressRepository
let sut: RemoveAddressUseCase

describe('Remove Address Use Case', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new RemoveAddressUseCase(addressRepository)
  })

  it('should remove the address if it exists and belongs to user', async () => {
    const address = await addressRepository.create({
      userId: 'user-1',
      street: 'Rua de Teste',
      number: '101',
      city: 'Cidade Teste',
      state: 'SP',
      zipcode: '12345-000',
      complement: 'Apto 101',
    })

    await sut.execute(address.id, 'user-1')

    const result = await addressRepository.findById(address.id)
    expect(result).toBeNull()
  })

  it('should throw AddressNotFoundError if address does not exist', async () => {
    await expect(() =>
      sut.execute('nonexistent-id', 'user-1'),
    ).rejects.toBeInstanceOf(AddressNotFoundError)
  })

  it('should throw AddressNotFoundError if address does not belong to user', async () => {
    const address = await addressRepository.create({
      userId: 'user-1',
      street: 'Rua Teste',
      number: '202',
      city: 'Cidade Teste',
      state: 'SP',
      zipcode: '54321-000',
      complement: 'Apto 202',
    })

    await expect(() =>
      sut.execute(address.id, 'user-2'),
    ).rejects.toBeInstanceOf(AddressNotFoundError)
  })
})
