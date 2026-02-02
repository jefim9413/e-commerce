import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryCartRepository } from '@/core/repositories/in-memory/in-memory-cart-repository'
import { RemoveCartItemUseCase } from './remove-cart-item'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let cartRepository: InMemoryCartRepository
let sut: RemoveCartItemUseCase

describe('RemoveCartItemUseCase', () => {
  beforeEach(() => {
    cartRepository = new InMemoryCartRepository()
    sut = new RemoveCartItemUseCase(cartRepository)
  })

  it('should be able to remove an existing cart item', async () => {
    await cartRepository.create({
      userId: 'user-123',
      productId: 'product-abc',
      quantity: 3,
    })

    const existingItem = await cartRepository.findByUserAndProduct(
      'user-123',
      'product-abc',
    )
    expect(existingItem).toBeTruthy()

    await sut.execute({
      userId: 'user-123',
      productId: 'product-abc',
    })

    const deletedItem = await cartRepository.findByUserAndProduct(
      'user-123',
      'product-abc',
    )
    expect(deletedItem).toBeNull()
  })

  it('should throw ResourceNotFoundError if item does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-not-exist',
        productId: 'product-not-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not allow user to remove item from another user', async () => {
    await cartRepository.create({
      userId: 'user-A',
      productId: 'product-1',
      quantity: 1,
    })

    await expect(() =>
      sut.execute({ userId: 'user-B', productId: 'product-1' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should allow multiple items to be removed individually', async () => {
    await cartRepository.create({
      userId: 'user-1',
      productId: 'product-1',
      quantity: 1,
    })

    await cartRepository.create({
      userId: 'user-1',
      productId: 'product-2',
      quantity: 2,
    })

    await sut.execute({ userId: 'user-1', productId: 'product-1' })

    const item1 = await cartRepository.findByUserAndProduct(
      'user-1',
      'product-1',
    )
    const item2 = await cartRepository.findByUserAndProduct(
      'user-1',
      'product-2',
    )

    expect(item1).toBeNull()
    expect(item2).toBeTruthy()
  })

  it('should throw if trying to remove with non-existent productId', async () => {
    await expect(() =>
      sut.execute({ userId: 'user-xyz', productId: 'invalid-product' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
