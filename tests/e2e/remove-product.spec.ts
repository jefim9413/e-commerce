import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'

describe('Remove Product (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to remove a product', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const createResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Teste',
        price: 100,
        description: 'Produto para remoção',
        stock: 30,
      })

    const id = createResponse.body.product.id

    const response = await request(app.server)
      .delete(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id,
        name: 'Produto Teste',
      }),
    )
  })

  it('should return 404 if product does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const response = await request(app.server)
      .delete('/products/non-existent-id')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Product not found',
      }),
    )
  })
})
