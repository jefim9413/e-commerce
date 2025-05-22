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
      name: 'Monitor 144Hz',
      description: 'Monitor gamer full HD 144Hz 24 polegadas',
      price: 999.99,
      stock: 30,
      imageUrl: 'https://example.com/monitor.jpg',
    })
  return response.body.product.id
}

describe('List User Orders (e2e)', () => {
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

  it('should list all orders for the admin user', async () => {
    const userAdmin = await createAndAuthenticateUser(
      app,
      true,
      'admin@example.com',
    )
    const productId = await createProduct(userAdmin.token)

    const userA = await createAndAuthenticateUser(
      app,
      false,
      `userA-${Date.now()}@example.com`,
    )
    const userB = await createAndAuthenticateUser(
      app,
      false,
      `userB-${Date.now()}@example.com`,
    )

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ productId, quantity: 1 })
    await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${userA.token}`)
      .send()

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ productId, quantity: 2 })
    await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${userB.token}`)
      .send()

    const ordersResponse = await request(app.server)
      .get('/orders')
      .set('Authorization', `Bearer ${userAdmin.token}`)

    expect(ordersResponse.statusCode).toBe(200)
    expect(ordersResponse.body.orders.length).toBe(2)
    // Extra: Validar userId se seu helper retornar userId
    // const orderUserIds = ordersResponse.body.orders.map((order: any) => order.userId)
    // expect(orderUserIds).toContain(userA.userId)
    // expect(orderUserIds).toContain(userB.userId)
  })

  it('should list only orders for the authenticated user', async () => {
    const userAdmin = await createAndAuthenticateUser(
      app,
      true,
      'admin2@example.com',
    )
    const productId = await createProduct(userAdmin.token)
    const user = await createAndAuthenticateUser(
      app,
      false,
      `user-single-${Date.now()}@example.com`,
    )

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ productId, quantity: 2 })
    await request(app.server)
      .post('/checkout')
      .set('Authorization', `Bearer ${user.token}`)
      .send()

    const ordersResponse = await request(app.server)
      .get('/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(ordersResponse.statusCode).toBe(200)
    expect(ordersResponse.body.orders).toHaveLength(1)
  })
})
