import { describe, it, expect, beforeEach } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { Role } from '@prisma/client'
import { InMemoryUsersRepository } from '@/core/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(usersRepository)
  })

  it('should authenticate a user with correct credentials', async () => {
    await usersRepository.create({
      id: 'user-id-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
      role: Role.MEMBER,
      createdAt: new Date(),
    })

    const response = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.user).toBeTruthy()
    expect(response.user.id).toEqual(expect.any(String))
  })

  it('should not authenticate if email is incorrect', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate if password is incorrect', async () => {
    await usersRepository.create({
      id: 'user-id-2',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('correct-password', 6),
      role: Role.MEMBER,
      createdAt: new Date(),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
