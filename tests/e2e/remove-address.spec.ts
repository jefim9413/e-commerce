import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/config/prisma/database'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Remove Address (e2e)', () => {
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

  it('should remove the address for the authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // Criação de um endereço para o usuário
    const createResponse = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua Teste',
        number: '123',
        city: 'Cidade Teste',
        state: 'SP',
        zipcode: '12345-000',
        complement: 'Apto 101',
      })
    const addressId = createResponse.body.address.id

    // Remover o endereço
    const deleteResponse = await request(app.server)
      .delete(`/addresses/${addressId}`)
      .set('Authorization', `Bearer ${token}`)

    // Verificar resposta
    expect(deleteResponse.statusCode).toBe(204)

    // Verificar se o endereço foi realmente removido
    const addressAfterDelete = await prisma.address.findUnique({
      where: { id: addressId },
    })
    expect(addressAfterDelete).toBeNull() // O endereço deve ter sido removido
  })

  it('should return 404 if address does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .delete('/addresses/nonexistent-id')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
  })

  it('should return 404 if address does not belong to the user', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createResponse = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: 'Rua Teste',
        number: '456',
        city: 'Cidade Teste',
        state: 'SP',
        zipcode: '54321-000',
        complement: 'Apto 202',
      })
    const addressId = createResponse.body.address.id

    const anotherUserToken = await createAndAuthenticateUser(
      app,
      false,
      'another-user@teste.com',
    )

    const response = await request(app.server)
      .delete(`/addresses/${addressId}`)
      .set('Authorization', `Bearer ${anotherUserToken.token}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
  })
})
