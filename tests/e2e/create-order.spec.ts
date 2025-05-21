import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'

describe('Create Order (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
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
      .send()
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

    const response = await request(app.server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
  })
})
