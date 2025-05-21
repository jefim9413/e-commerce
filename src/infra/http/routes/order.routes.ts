import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createOrder } from '../controllers/create-order'

export async function orderRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/checkout', createOrder)
}
