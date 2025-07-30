import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/config/prisma/database'

describe('List Addresses (e2e)', () => {
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

  it('should list all addresses for the authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(
      app,
      false,
      'user@teste.com',
    )

    await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua dos Bobos',
        number: '0',
        city: 'Bobópolis',
        state: 'BB',
        zipcode: '12345000',
        complement: '',
      })

    await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua Alegre',
        number: '77',
        city: 'Sorrisolândia',
        state: 'SR',
        zipcode: '22222000',
        complement: 'Casa dos fundos',
      })

    const response = await request(app.server)
      .get('/addresses')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.addresses).toHaveLength(2)
    expect(response.body.addresses[0].userId).toBeDefined()
    expect(response.body.addresses[1].street).toBe('Rua Alegre')
  })
})
