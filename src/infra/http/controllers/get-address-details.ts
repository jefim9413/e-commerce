import { AddressNotFoundError } from '@/core/usecases/errors/address-not-found-error'
import { makeGetAddressDetails } from '@/infra/factories/make-get-address-details'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function getAddressDetails(
  request: FastifyRequest<{ Params: { addressId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { addressId } = request.params
    const userId = request.user.sub

    const getAddressDetailsUseCase = makeGetAddressDetails()
    const { address } = await getAddressDetailsUseCase.execute({
      addressId,
      userId,
    })

    return reply.status(200).send({ address })
  } catch (err) {
    if (err instanceof AddressNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
