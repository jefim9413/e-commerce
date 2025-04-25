import { makeGetUserProfileUser } from '@/infra/factories/make-get-user-profile-user'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const getUserProfileUseCase = makeGetUserProfileUser()

  const { user } = await getUserProfileUseCase.execute({ userId })

  return reply.status(200).send({ user })
}
