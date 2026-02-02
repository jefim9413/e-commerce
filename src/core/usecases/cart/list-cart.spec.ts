import { describe, it, expect, beforeEach } from 'vitest'
import { ListCartUseCase } from './list-cart'
import { InMemoryCartRepository } from '@/core/repositories/in-memory/in-memory-cart-repository'

let cartRepository: InMemoryCartRepository
let sut: ListCartUseCase

describe('List Cart Use Case', () => {
  beforeEach(() => {
    cartRepository = new InMemoryCartRepository()
    sut = new ListCartUseCase(cartRepository)
  })

  it('should list all items in the user cart', async () => {
    await cartRepository.create({
      userId: 'user-1',
      productId: 'product-1',
      quantity: 2,
    })

    await cartRepository.create({
      userId: 'user-1',
      productId: 'product-2',
      quantity: 1,
    })

    await cartRepository.create({
      userId: 'user-2',
      productId: 'product-3',
      quantity: 5,
    })

    const { items } = await sut.execute({ userId: 'user-1' })

    expect(items).toHaveLength(2)
    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId: 'product-1' }),
        expect.objectContaining({ productId: 'product-2' }),
      ]),
    )
  })

  it('should return an empty list if user has no items', async () => {
    const { items } = await sut.execute({ userId: 'user-999' })

    expect(items).toHaveLength(0)
  })
})
