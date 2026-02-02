import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryCartRepository } from '@/core/repositories/in-memory/in-memory-cart-repository'
import { InMemoryProductsRepository } from '@/core/repositories/in-memory/in-memory-products-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryOrderRepository } from '@/core/repositories/in-memory/in-memory-orders-repository'
import { CartIsEmptyError } from '../errors/cart-is-empty-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'
import { CreateOrderUseCase } from './create-order'
import { InMemoryAddressRepository } from '@/core/repositories/in-memory/in-memory-address-repository'
import { AddressNotFoundError } from '../errors/address-not-found-error' // Adicione este erro

let cartRepository: InMemoryCartRepository
let productsRepository: InMemoryProductsRepository
let orderRepository: InMemoryOrderRepository
let addressRepository: InMemoryAddressRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    cartRepository = new InMemoryCartRepository()
    productsRepository = new InMemoryProductsRepository()
    orderRepository = new InMemoryOrderRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new CreateOrderUseCase(
      orderRepository,
      cartRepository,
      productsRepository,
      addressRepository,
    )
  })

  it('should create an order with valid cart items', async () => {
    const userId = 'user-1'
    const product = await productsRepository.create({
      name: 'Produto Teste',
      description: 'Descrição',
      price: new Decimal(150),
      stock: 5,
      imageUrl: null,
    })
    const address = await addressRepository.create({
      userId,
      street: 'Rua das Flores',
      number: '123',
      city: 'Cidade Exemplo',
      state: 'SP',
      zipcode: '12345-678',
      complement: 'Apto 101',
    })

    await cartRepository.create({
      userId,
      productId: product.id,
      quantity: 2,
    })

    const { order } = await sut.execute({ userId, addressId: address.id })

    expect(order).toBeTruthy()
    expect(order.total).toBeInstanceOf(Decimal)
    expect(order.total.toNumber()).toBe(300)

    const savedOrder = orderRepository.orders.find((o) => o.id === order.id)
    expect(savedOrder).toBeTruthy()
    expect(savedOrder?.items).toHaveLength(1)
  })

  it('should throw AddressNotFoundError if address does not exist', async () => {
    const userId = 'user-not-exists'
    await expect(() =>
      sut.execute({ userId, addressId: 'address-999' }),
    ).rejects.toBeInstanceOf(AddressNotFoundError)
  })

  it('should throw CartIsEmptyError if cart is empty', async () => {
    const userId = 'user-without-cart'
    const address = await addressRepository.create({
      userId,
      street: 'Rua X',
      number: '1',
      city: 'Cidade',
      state: 'SP',
      zipcode: '11111-111',
      complement: 'Apto 2',
    })
    await expect(() =>
      sut.execute({ userId, addressId: address.id }),
    ).rejects.toBeInstanceOf(CartIsEmptyError)
  })

  it('should throw ProductNotFoundError if any product in cart does not exist', async () => {
    const userId = 'user-2'
    const address = await addressRepository.create({
      userId,
      street: 'Rua Y',
      number: '3',
      city: 'Cidade Y',
      state: 'SP',
      zipcode: '22222-222',
      complement: '',
    })
    await cartRepository.create({
      userId,
      productId: 'non-existent-product-id',
      quantity: 1,
    })

    await expect(() =>
      sut.execute({ userId, addressId: address.id }),
    ).rejects.toBeInstanceOf(ProductNotFoundError)
  })
})
