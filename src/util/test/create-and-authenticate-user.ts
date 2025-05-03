import { prisma } from '@/config/prisma/database'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const email = 'johndoe@example.com'

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email,
        password: await hash('123456', 6),
        role: isAdmin ? 'ADMIN' : 'MEMBER',
      },
    })
  }

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
