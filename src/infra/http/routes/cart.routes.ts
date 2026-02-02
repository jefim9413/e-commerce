import { FastifyInstance } from 'fastify'
import { addToCart } from '../controllers/add-to-cart'
import { verifyJwt } from '../middlewares/verify-jwt'
import { listCart } from '../controllers/list-cart'
import { removeCartItem } from '../controllers/remove-cart-item'

export async function cartRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/cart', addToCart)
  app.get('/cart', listCart)
  app.delete('/cart/:productId', removeCartItem)
}
