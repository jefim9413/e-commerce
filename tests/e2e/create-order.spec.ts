import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { prisma } from '@/config/prisma/database'

describe('Create Order (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  beforeEach(async () => {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.address.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should create a new order with items from cart', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const productResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Monitor 144Hz',
        description: 'Monitor gamer full HD 144Hz 24 polegadas',
        price: 999.99,
        stock: 30,
        imageUrl: 'https://example.com/monitor.jpg',
      })
    const productId = productResponse.body.product.id

    const addressResponse = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua dos Testes',
        number: '123',
        city: 'Cidade Teste',
        state: 'SP',
        zipcode: '12345678',
        complement: 'Apto 1',
      })
    const addressId = addressResponse.body.address.id

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 2,
      })

    const orderResponse = await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        addressId,
      })
    expect(orderResponse.statusCode).toBe(201)
    expect(orderResponse.body.order).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: expect.any(String),
        total: expect.any(String),
        createdAt: expect.any(String),
      }),
    )
    expect(orderResponse.body.order.items[0]).toEqual(
      expect.objectContaining({
        productId,
        quantity: 2,
        price: expect.any(String),
      }),
    )
  })

  it('should not create order if cart is empty', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const addressResponse = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua dos Testes',
        number: '123',
        city: 'Cidade Teste',
        state: 'SP',
        zipcode: '12345678',
        complement: 'Apto 1',
      })
    const addressId = addressResponse.body.address.id

    const response = await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        addressId,
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBeDefined()
  })
})
