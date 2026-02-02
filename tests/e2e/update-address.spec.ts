import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { prisma } from '@/config/prisma/database'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Update Address (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  beforeEach(async () => {
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should update an address for the authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createResponse = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua Original',
        number: '10',
        city: 'Cidade',
        state: 'SP',
        zipcode: '00000-000',
        complement: 'Apto 1',
      })
    const addressId = createResponse.body.address.id

    const updateResponse = await request(app.server)
      .patch(`/addresses/${addressId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua Alterada',
      })

    expect(updateResponse.statusCode).toBe(200)
    expect(updateResponse.body.address.street).toBe('Rua Alterada')
    expect(updateResponse.body.address.city).toBe('Cidade')
  })

  it('should return 404 if address does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const updateResponse = await request(app.server)
      .patch('/addresses/nonexistent-id')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Nova Rua',
      })

    expect(updateResponse.statusCode).toBe(404)
  })
})
