import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAddressRepository } from '@/core/repositories/in-memory/in-memory-address-repository'
import { UpdateAddressUseCase } from './update-address'
import { AddressNotFoundError } from '../errors/address-not-found-error'

let addressRepository: InMemoryAddressRepository
let sut: UpdateAddressUseCase

describe('Update Address UseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new UpdateAddressUseCase(addressRepository)
  })

  it('should update the address if it exists and belongs to user', async () => {
    const address = await addressRepository.create({
      userId: 'user-1',
      street: 'Antiga',
      number: '123',
      city: 'Cidade',
      state: 'SP',
      zipcode: '12345-678',
      complement: 'Apto 1',
    })

    const result = await sut.execute(address.id, 'user-1', {
      street: 'Nova Rua',
      city: 'Cidade',
    })

    expect(result.address.street).toBe('Nova Rua')
    expect(result.address.city).toBe('Cidade')
  })

  it('should throw if address does not exist', async () => {
    await expect(() =>
      sut.execute('nonexistent', 'user-1', { street: 'Qualquer' }),
    ).rejects.toBeInstanceOf(AddressNotFoundError)
  })

  it('should throw if address does not belong to user', async () => {
    const address = await addressRepository.create({
      userId: 'user-1',
      street: 'Antiga',
      number: '123',
      city: 'Cidade',
      state: 'SP',
      zipcode: '12345-678',
      complement: 'Apto 1',
    })

    await expect(() =>
      sut.execute(address.id, 'user-2', {
        street: 'Nova Rua',
      }),
    ).rejects.toBeInstanceOf(AddressNotFoundError)
  })
})
