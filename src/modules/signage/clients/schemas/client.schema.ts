import { z } from 'zod'
import { cnpjSchema, requiredString } from '@/lib/validation/common'

export const corporateClientFormSchema = z.object({
  legalName: requiredString('Razão social obrigatória.'),
  cnpj: cnpjSchema,
  contactName: requiredString('Contacto obrigatório.'),
})

export type CorporateClientFormInput = z.infer<typeof corporateClientFormSchema>
