import { FastifyReply, FastifyRequest } from 'fastify'
import { SessionsDTO } from '@/core/validations/user.schema'
import { makeAuthenticateUser } from '@/infra/factories/make-authenticate-user'
import { InvalidCredentialsError } from '@/core/usecases/errors/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest<{ Body: SessionsDTO }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  try {
    const authenticateUserUseCase = makeAuthenticateUser()

    const { user } = await authenticateUserUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.code(400).send({ message: err.message })
    }
    throw err
  }
}
