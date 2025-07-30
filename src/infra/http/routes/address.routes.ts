import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createAddress } from '../controllers/create-address'
import { listUserAddress } from '../controllers/list-address'

export async function addressRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/addresses', createAddress)
  app.get('/addresses', listUserAddress)
}
