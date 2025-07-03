import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createOrder } from '../controllers/create-order'
import { listUserOrders } from '../controllers/list-user-orders'
import { getOrderDetails } from '../controllers/get-order-details'

export async function orderRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/checkout', createOrder)
  app.get('/orders', listUserOrders)

  app.get('/orders/:id', getOrderDetails)
}
