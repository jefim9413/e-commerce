import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z
    .string()
    .min(10, 'JWT_SECRET precisa ter pelo menos 10 caracteres'),
  DATABASE_URL: z.string().url('DATABASE_URL precisa ser uma URL válida'),
  PORT: z.coerce.number().min(1024).max(65535).default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
