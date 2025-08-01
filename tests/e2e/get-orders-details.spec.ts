import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/config/prisma/database'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

async function createProduct(adminToken: string) {
  const response = await request(app.server)
    .post('/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Headset Gamer',
      description: 'Headset 7.1 surround',
      price: 299.99,
      stock: 10,
      imageUrl: 'https://example.com/headset.jpg',
    })
  return response.body.product.id
}

describe('Get Order Details (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  beforeEach(async () => {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cart.deleteMany?.()
    await prisma.user.deleteMany()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should return details of an order for the authenticated user', async () => {
    const admin = await createAndAuthenticateUser(
      app,
      true,
      'admin@example.com',
    )
    const user = await createAndAuthenticateUser(
      app,
      false,
      'customer@example.com',
    )

    const productId = await createProduct(admin.token)

    const addressResponse = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${user.token}`)
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
      .set('Authorization', `Bearer ${user.token}`)
      .send({ productId, quantity: 2 })

    const checkoutResponse = await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ addressId })

    const createdOrderId = checkoutResponse.body.order.id

    const orderDetailResponse = await request(app.server)
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(orderDetailResponse.statusCode).toBe(200)
    expect(orderDetailResponse.body.order).toBeTruthy()
    expect(orderDetailResponse.body.order.id).toBe(createdOrderId)
    expect(orderDetailResponse.body.order.items.length).toBe(1)
    expect(orderDetailResponse.body.order.items[0].productId).toBe(productId)
    expect(orderDetailResponse.body.order.items[0].quantity).toBe(2)
  })
})
