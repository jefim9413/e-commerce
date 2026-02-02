import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createOrder } from '../controllers/create-order'
import { listUserOrders } from '../controllers/list-user-orders'
import { getOrderDetails } from '../controllers/get-order-details'
import { verifyUserRole } from '../middlewares/verify-user-role'
import { updateOrderStatus } from '../controllers/update-order-status'

export async function orderRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/checkout', createOrder)
  app.get('/orders', listUserOrders)

  app.get('/orders/:id', getOrderDetails)

  app.register(async (privateRoutes) => {
    privateRoutes.addHook('onRequest', verifyJwt)
    privateRoutes.addHook('onRequest', verifyUserRole('ADMIN'))

    privateRoutes.patch('/orders/:orderId/status', updateOrderStatus)
  })
}
