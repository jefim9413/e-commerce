import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './config/env'
import { usersRoutes } from './infra/http/routes/user.routes'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { productRoutes } from './infra/http/routes/product.routes'
import { cartRoutes } from './infra/http/routes/cart.routes'

export const app = fastify()

app.register(fastifyCookie)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },

  sign: {
    expiresIn: '10m',
  },
})

app.register(usersRoutes)
app.register(productRoutes)
app.register(cartRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
