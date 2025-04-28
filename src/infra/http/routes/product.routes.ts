import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'
import { createProduct } from '../controllers/create-product'

export async function productRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('ADMIN'))

  app.post('/products', createProduct)
}
