import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'

describe('Remove Cart Item (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should remove a cart item by productId', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const productResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Headset Gamer',
        description: 'Headset com som 7.1',
        price: 399.99,
        stock: 20,
        imageUrl: null,
      })

    const productId = productResponse.body.product.id

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 1,
      })

    const response = await request(app.server)
      .delete(`/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const listResponse = await request(app.server)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(listResponse.body.items).toHaveLength(0)
  })
  it("should not allow one user to remove another user's cart item", async () => {
    const userA = await createAndAuthenticateUser(
      app,
      false,
      'userA@example.com',
    )
    const userB = await createAndAuthenticateUser(
      app,
      false,
      'userB@example.com',
    )
    const admin = await createAndAuthenticateUser(app, true)
    const productResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 'Mouse Gamer',
        description: 'Mouse com 12000 DPI',
        price: 149.99,
        stock: 10,
        imageUrl: null,
      })

    const productId = productResponse.body.product.id

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({
        productId,
        quantity: 1,
      })

    const removeResponse = await request(app.server)
      .delete(`/cart/${productId}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .send()

    expect(removeResponse.statusCode).toBe(404)

    const listResponse = await request(app.server)
      .get('/cart')
      .set('Authorization', `Bearer ${userA.token}`)
      .send()

    expect(listResponse.statusCode).toBe(200)
    expect(listResponse.body.items).toHaveLength(1)
    expect(listResponse.body.items[0].productId).toBe(productId)
  })
})
