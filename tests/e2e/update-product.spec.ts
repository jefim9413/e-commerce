import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { Decimal } from '@prisma/client/runtime/library'

describe('Update Product (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should update an existing product', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const createResponse = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Original',
        description: 'Descrição original',
        price: 150,
        stock: 10,
        imageUrl: 'https://example.com/original.jpg',
      })

    const productId = createResponse.body.product.id

    const updateResponse = await request(app.server)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Atualizado',
        price: new Decimal(200).toNumber(),
      })

    expect(updateResponse.statusCode).toBe(200)
    expect(updateResponse.body.product).toEqual(
      expect.objectContaining({
        id: productId,
        name: 'Produto Atualizado',
        price: expect.any(String),
        description: 'Descrição original',
      }),
    )
  })

  it('should return 404 if product does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .put('/products/non-existent-id')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Teste',
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toEqual('Resource not found.')
  })
})
