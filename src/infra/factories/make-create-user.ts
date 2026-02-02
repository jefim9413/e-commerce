import { PrismaUsersRepository } from '@/core/repositories/prisma/prisma-users-repository'
import { CreateUserUseCase } from '@/core/usecases/user/create-user'

export function makeCreateUser() {
  const usersRepository = new PrismaUsersRepository()
  const createUserUseCase = new CreateUserUseCase(usersRepository)

  return createUserUseCase
}
