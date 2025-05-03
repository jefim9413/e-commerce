import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'

describe('List Products (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list products', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Mouse Gamer',
        description: 'Mouse RGB 7200 DPI',
        price: 149.99,
        stock: 50,
        imageUrl: 'https://example.com/mouse.jpg',
      })

    const response = await request(app.server).get('/products').send()

    expect(response.statusCode).toBe(200)
    expect(response.body.products).toHaveLength(1)
    expect(response.body.products[0]).toEqual(
      expect.objectContaining({
        name: 'Mouse Gamer',
        description: 'Mouse RGB 7200 DPI',
        price: expect.any(String),
        stock: 50,
      }),
    )
  })
})
