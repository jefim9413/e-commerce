import { FastifyRequest, FastifyReply } from 'fastify'
import { AddressNotFoundError } from '@/core/usecases/errors/address-not-found-error'
import { UpdateAddressDTO } from '@/core/validations/address.schema'
import { makeUpdateAddress } from '@/infra/factories/make-update-address'

export async function updateAddress(
  request: FastifyRequest<{
    Params: { addressId: string }
    Body: UpdateAddressDTO
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub
    const { addressId } = request.params
    const { street, number, city, state, zipcode, complement } = request.body

    const updateAddressUseCase = makeUpdateAddress()
    const { address } = await updateAddressUseCase.execute(addressId, userId, {
      street,
      number,
      city,
      state,
      zipcode,
      complement,
    })
    return reply.status(200).send({ address })
  } catch (err) {
    if (err instanceof AddressNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
