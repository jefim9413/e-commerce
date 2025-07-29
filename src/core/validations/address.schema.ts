import { z } from 'zod'

export const createAddressSchema = z.object({
  street: z.string().min(2, 'Rua deve ter pelo menos 2 caracteres'),
  number: z.string().min(1, 'Número obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  zipcode: z.string().min(8, 'CEP deve ter pelo menos 8 caracteres'),
  complement: z.string().optional(),
})

export type CreateAddressDTO = z.infer<typeof createAddressSchema>
