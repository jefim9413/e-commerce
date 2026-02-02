import { makeListAddress } from '@/infra/factories/make-list-address'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function listUserAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub
    const listUserAddressesUseCase = makeListAddress()

    const { addresses } = await listUserAddressesUseCase.execute({ userId })

    return reply.status(200).send({ addresses })
  } catch (err) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
