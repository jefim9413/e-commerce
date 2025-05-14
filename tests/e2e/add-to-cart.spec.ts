import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'

describe('Add To Cart (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to add a product to the cart', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const productResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Teclado Gamer',
        description: 'Teclado mecânico com switch azul',
        price: 250.0,
        stock: 15,
        imageUrl: 'https://example.com/teclado.jpg',
      })

    expect(productResponse.statusCode).toBe(201)
    expect(productResponse.body.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Teclado Gamer',
        description: expect.any(String),
        price: expect.any(String),
        stock: expect.any(Number),
      }),
    )

    const productId = productResponse.body.product.id

    const cartResponse = await request(app.server)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 2,
      })

    expect(cartResponse.statusCode).toBe(201)
    expect(cartResponse.body.item).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        productId,
        quantity: 2,
        userId: expect.any(String),
        createdAt: expect.any(String),
      }),
    )
  })
})
