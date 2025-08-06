import { z } from 'zod'

export const createAddressSchema = z.object({
  street: z.string().min(2, 'Rua deve ter pelo menos 2 caracteres'),
  number: z.string().min(1, 'Número obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  zipcode: z.string().min(8, 'CEP deve ter pelo menos 8 caracteres'),
  complement: z.string().optional(),
})
export const updateAddressSchema = z.object({
  street: z.string().min(1, 'Rua obrigatória').optional(),
  number: z.string().min(1, 'Número obrigatório').optional(),
  city: z.string().min(1, 'Cidade obrigatória').optional(),
  state: z.string().min(1, 'Estado obrigatório').optional(),
  zipcode: z.string().min(1, 'CEP obrigatório').optional(),
  complement: z.string().optional(),
})

export type UpdateAddressDTO = z.infer<typeof updateAddressSchema>

export type CreateAddressDTO = z.infer<typeof createAddressSchema>
