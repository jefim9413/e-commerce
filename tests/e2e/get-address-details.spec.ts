import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { prisma } from '@/config/prisma/database'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Get Address Details (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  beforeEach(async () => {
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should return address details for authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const addressResponse = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua E2E',
        number: '99',
        city: 'Cidade',
        state: 'SP',
        zipcode: '99999-999',
        complement: 'Apto 99',
      })
    const addressId = addressResponse.body.address.id

    const detailResponse = await request(app.server)
      .get(`/addresses/${addressId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(detailResponse.statusCode).toBe(200)
    expect(detailResponse.body.address).toBeTruthy()
    expect(detailResponse.body.address.id).toBe(addressId)
  })

  it('should return 404 if address does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const response = await request(app.server)
      .get('/addresses/non-existent-id')
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(404)
  })
})
