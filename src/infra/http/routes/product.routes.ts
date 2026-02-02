import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'
import { createProduct } from '../controllers/create-product'
import { listProducts } from '../controllers/list-products'
import { removeProduct } from '../controllers/remove-product'
import { getProduct } from '../controllers/get-product'
import { updateProduct } from '../controllers/update-product'

export async function productRoutes(app: FastifyInstance) {
  app.get('/products', listProducts)
  app.get('/products/:id', getProduct)

  app.register(async (privateRoutes) => {
    privateRoutes.addHook('onRequest', verifyJwt)
    privateRoutes.addHook('onRequest', verifyUserRole('ADMIN'))

    privateRoutes.post('/products', createProduct)
    privateRoutes.delete('/products/:id', removeProduct)
    privateRoutes.put('/products/:id', updateProduct)
  })
}
