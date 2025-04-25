import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'
import { InMemoryUsersRepository } from '@/core/repositories/in-memory/in-memory-users-repository'
import { Role } from '@prisma/client'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('GetUserProfile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should return user profile if user exists', async () => {
    const createdUser = await usersRepository.create({
      id: 'user-id-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
      role: Role.MEMBER,
      createdAt: new Date(),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        email: 'johndoe@example.com',
      }),
    )
  })

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
