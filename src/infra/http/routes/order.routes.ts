import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createOrder } from '../controllers/create-order'
import { listUserOrders } from '../controllers/list-user-orders'

export async function orderRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/checkout', createOrder)
  app.get('/orders', listUserOrders)
}
