import { z } from 'zod'
import { emailSchema, phoneSchema, requiredString } from '@/lib/validation/common'

export const accountProfileFormSchema = z.object({
  name: requiredString('Nome obrigatório.'),
  email: emailSchema,
  phone: z.union([phoneSchema, z.literal('')]).optional(),
})

export type AccountProfileFormInput = z.infer<typeof accountProfileFormSchema>
