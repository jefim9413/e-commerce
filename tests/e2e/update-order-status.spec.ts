import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/config/prisma/database'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { OrderStatus } from '@prisma/client'

async function createProduct(adminToken: string) {
  const response = await request(app.server)
    .post('/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Teclado Mecânico',
      description: 'Teclado RGB',
      price: 200,
      stock: 10,
      imageUrl: 'https://example.com/teclado.jpg',
    })
  return response.body.product.id
}
async function createAddress(userToken: string) {
  const response = await request(app.server)
    .post('/addresses')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      street: 'Rua dos Testes',
      number: '123',
      city: 'Cidade Teste',
      state: 'SP',
      zipcode: '12345678',
      complement: 'Apto 1',
    })
  return response.body.address.id
}

describe('Update Order Status (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cart.deleteMany?.()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should allow ADMIN to update order status', async () => {
    const admin = await createAndAuthenticateUser(
      app,
      true,
      'admin@exemplo.com',
    )
    const user = await createAndAuthenticateUser(
      app,
      false,
      'cliente@exemplo.com',
    )
    const productId = await createProduct(admin.token)

    const addressId = await createAddress(user.token)

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ productId, quantity: 1 })

    const checkoutResponse = await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ addressId })

    const orderId = checkoutResponse.body.order.id

    const updateResponse = await request(app.server)
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: OrderStatus.DELIVERED })

    expect(updateResponse.statusCode).toBe(204)

    const orderDetails = await request(app.server)
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${admin.token}`)

    expect(orderDetails.statusCode).toBe(200)
    expect(orderDetails.body.order.status).toBe(OrderStatus.DELIVERED)
  })

  it('should return 404 if order does not exist', async () => {
    const admin = await createAndAuthenticateUser(
      app,
      true,
      'admin2@exemplo.com',
    )

    const updateResponse = await request(app.server)
      .patch(`/orders/non-existent-order-id/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: OrderStatus.DELIVERED })

    expect(updateResponse.statusCode).toBe(404)
  })

  it('should return 400 for invalid status', async () => {
    const admin = await createAndAuthenticateUser(
      app,
      true,
      'admin3@exemplo.com',
    )
    const user = await createAndAuthenticateUser(
      app,
      false,
      'userinvalid@exemplo.com',
    )
    const productId = await createProduct(admin.token)

    const addressId = await createAddress(user.token)
    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ productId, quantity: 1 })

    const checkoutResponse = await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ addressId })

    const orderId = checkoutResponse.body.order.id

    const updateResponse = await request(app.server)
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'INVALID_STATUS' })

    expect(updateResponse.statusCode).toBe(400)
  })
})
