import { FastifyInstance } from 'fastify'
import { createUser } from '../controllers/create-user'
import { refresh } from '../controllers/refresh'
import { authenticate } from '../controllers/authenticate'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)
}
