import { z } from 'zod'

export const addToCartBodySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export type AddToCartBodyDTO = z.infer<typeof addToCartBodySchema>
