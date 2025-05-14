import { FastifyInstance } from 'fastify'
import { addToCart } from '../controllers/add-to-cart'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function cartRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/cart', addToCart)
}
