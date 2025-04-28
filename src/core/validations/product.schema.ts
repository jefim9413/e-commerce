import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().positive('Preço deve ser um número positivo'),
  stock: z.number().int('Estoque deve ser um número inteiro').nonnegative(),
  imageUrl: z.string().url('URL inválida').optional(),
})

export type CreateProductDTO = z.infer<typeof createProductSchema>
