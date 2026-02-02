import { createAddressSchema } from '@/core/validations/address.schema'
import { makeCreateAddress } from '@/infra/factories/make-create-address'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function createAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub
    const { street, number, city, state, zipcode, complement } =
      createAddressSchema.parse(request.body)

    const createAddressUseCase = makeCreateAddress()

    const { address } = await createAddressUseCase.execute({
      userId,
      street,
      number,
      city,
      state,
      zipcode,
      complement,
    })

    return reply.status(201).send({ address })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply
        .status(400)
        .send({ message: err.errors.map((e) => e.message).join(', ') })
    }
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
