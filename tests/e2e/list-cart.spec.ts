import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'

describe('List Cart (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return all cart items for the authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const productResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cadeira Gamer',
        description: 'Cadeira confortável com apoio lombar',
        price: 899.99,
        stock: 5,
        imageUrl: null,
      })

    const productId = productResponse.body.product.id

    await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 2,
      })
    const response = await request(app.server)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.items).toHaveLength(1)
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({
        productId,
        quantity: 2,
      }),
    )
  })
})
