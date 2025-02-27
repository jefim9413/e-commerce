import { FastifyInstance } from 'fastify'
import { createUser } from '../controllers/create-user'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
}
