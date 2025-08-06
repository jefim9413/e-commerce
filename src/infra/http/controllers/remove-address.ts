import { AddressNotFoundError } from '@/core/usecases/errors/address-not-found-error'
import { makeRemoveAddress } from '@/infra/factories/make-remove-address'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function removeAddress(
  request: FastifyRequest<{ Params: { addressId: string } }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub
    const { addressId } = request.params

    const removeAddressUseCase = makeRemoveAddress()

    await removeAddressUseCase.execute(addressId, userId)

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof AddressNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
