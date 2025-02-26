import { z } from 'zod'

export const registerUserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const loginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export type RegisterUserDTO = z.infer<typeof registerUserSchema>
export type LoginUserDTO = z.infer<typeof loginUserSchema>
