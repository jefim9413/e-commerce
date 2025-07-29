import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/config/prisma/database'

describe('Create Address (e2e)', () => {
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

  it('should create a new address for the authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua dos Testes',
        number: '456',
        city: 'Cidade Teste',
        state: 'SP',
        zipcode: '12345678',
        complement: 'Apto 404',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toBeTruthy()
    expect(response.body.address.street).toBe('Rua dos Testes')
    expect(response.body.address.complement).toBe('Apto 404')
  })

  it('should not create address if missing required fields', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        number: '789',
        city: 'Cidade Teste',
        state: 'SP',
        zipcode: '12345678',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBeDefined()
  })
})
