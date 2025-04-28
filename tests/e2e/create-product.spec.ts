import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'

describe('Create Product (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new product as ADMIN', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Monitor 144Hz',
        description: 'Monitor gamer full HD 144Hz 24 polegadas',
        price: 999.99,
        stock: 30,
        imageUrl: 'https://example.com/monitor.jpg',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Monitor 144Hz',
        description: expect.any(String),
        price: expect.any(String),
        stock: expect.any(Number),
      }),
    )
  })
})
