import { z } from 'zod'
import { requiredString } from '@/lib/validation/common'

export const signageCategoryFormSchema = z.object({
  name: requiredString('Nome da categoria obrigatório.'),
})

export type SignageCategoryFormInput = z.infer<typeof signageCategoryFormSchema>
