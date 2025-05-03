import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { Decimal } from '@prisma/client/runtime/library'

describe('Get Product (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a product by ID', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const createResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Teclado Mecânico',
        description: 'Teclado mecânico RGB com switches azuis',
        price: new Decimal(299.99),
        stock: 20,
        imageUrl: 'https://example.com/teclado.jpg',
      })

    const productId = createResponse.body.product.id

    const getResponse = await request(app.server)
      .get(`/products/${productId}`)
      .send()

    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.body.product).toEqual(
      expect.objectContaining({
        id: productId,
        name: 'Teclado Mecânico',
        price: expect.any(String),
        stock: 20,
      }),
    )
  })

  it('should return 404 if product does not exist', async () => {
    const response = await request(app.server)
      .get('/products/non-existing-id')
      .send()

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toEqual('Resource not found.')
  })
})
