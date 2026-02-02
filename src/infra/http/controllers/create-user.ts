import { UsersAlreadyExistsError } from '@/core/usecases/errors/users-already-exists-error'
import { CreateUserDTO } from '@/core/validations/user.schema'
import { makeCreateUser } from '@/infra/factories/make-create-user'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createUser(
  request: FastifyRequest<{ Body: CreateUserDTO }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body
  try {
    const createUserUseCase = makeCreateUser()
    const { user } = await createUserUseCase.execute({ name, email, password })

    return reply.status(201).send({ user })
  } catch (err) {
    if (err instanceof UsersAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
