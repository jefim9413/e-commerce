import { FastifyInstance } from 'fastify'
import { createUser } from '../controllers/create-user'
import { refresh } from '../controllers/refresh'
import { authenticate } from '../controllers/authenticate'
import { verifyJwt } from '../middlewares/verify-jwt'
import { getProfile } from '../controllers/profile'
import { logout } from '../controllers/logout'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)
  app.post('/logout', logout)

  app.get('/me', { onRequest: [verifyJwt] }, getProfile)
}
