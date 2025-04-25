import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('logout (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should clear the refresh token cookie on logout', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const logoutResponse = await request(app.server)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const setCookieHeader = logoutResponse.get('Set-Cookie')
    const cookies = setCookieHeader ? setCookieHeader.join(';') : ''

    expect(cookies).toContain('refreshToken=')
    expect(cookies).toContain('Expires=Thu, 01 Jan 1970')
  })
})
