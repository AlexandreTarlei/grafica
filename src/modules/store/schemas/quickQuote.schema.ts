import { z } from 'zod'
import { emailSchema, requiredString } from '@/lib/validation/common'

export const quickQuoteFormSchema = z.object({
  nome: requiredString('Nome obrigatório.'),
  email: emailSchema,
  tel: z.string().optional(),
  cat: z.string().min(1, 'Selecione o tipo de produto.'),
  width: z.number().min(1),
  height: z.number().min(1),
  qty: z.number().min(1),
  notes: z.string().optional(),
})

export type QuickQuoteFormInput = z.infer<typeof quickQuoteFormSchema>
