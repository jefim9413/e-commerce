import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createAddress } from '../controllers/create-address'

export async function addressRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/addresses', createAddress)
}
