import { UsersRepository } from '@/core/repositories/users-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUserUsecaseRequest {
  email: string
  password: string
}

interface AuthenticateUserUsecaseResponse {
  user: User
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUsecaseRequest): Promise<AuthenticateUserUsecaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
