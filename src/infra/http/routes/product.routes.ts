import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'
import { createProduct } from '../controllers/create-product'

export async function productRoutes(app: FastifyInstance) {
  app.register(async (privateRoutes) => {
    privateRoutes.addHook('onRequest', verifyJwt)
    privateRoutes.addHook('onRequest', verifyUserRole('ADMIN'))

    privateRoutes.post('/products', createProduct)
  })
}
