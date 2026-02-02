import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createAddress } from '../controllers/create-address'
import { listUserAddress } from '../controllers/list-address'
import { getAddressDetails } from '../controllers/get-address-details'
import { updateAddress } from '../controllers/update-address'
import { removeAddress } from '../controllers/remove-address'

export async function addressRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/addresses', createAddress)
  app.get('/addresses', listUserAddress)
  app.get('/addresses/:addressId', getAddressDetails)
  app.patch('/addresses/:addressId', updateAddress)
  app.delete('/addresses/:addressId', removeAddress)
}
