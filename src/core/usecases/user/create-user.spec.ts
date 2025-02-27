import { UsersRepository } from '@/core/repositories/users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/core/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { CreateUserUseCase } from '@/core/usecases/user/create-user'
import { UsersAlreadyExistsError } from '@/core/usecases/errors/users-already-exists-error'

let usersRepository: UsersRepository
let sut: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'u8qFP@example.com',
      password: '1234567890',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not create a user with the same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'exemple@example.com',
      password: '1234567789',
    })

    await expect(
      sut.execute({
        name: 'John Doe',
        email: 'exemple@example.com',
        password: '1234567789',
      }),
    ).rejects.toBeInstanceOf(UsersAlreadyExistsError)
  })

  it('should not hash user password', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'exemple@example.com',
      password: '1234567789',
    })

    const isPasswordHashed = await compare('1234567789', user.password)

    expect(isPasswordHashed).toBe(true)
  })
})
