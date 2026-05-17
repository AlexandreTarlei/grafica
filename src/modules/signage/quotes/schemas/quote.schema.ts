import { z } from 'zod'
import { SIGNAGE_PRODUCT_CATEGORIES } from '@/modules/signage/products/types'
import { currencySchema, requiredString } from '@/lib/validation/common'

const lineSchema = z.object({
  productName: requiredString('Descrição obrigatória.'),
  category: z.enum(SIGNAGE_PRODUCT_CATEGORIES),
  widthCm: z.number().min(1),
  heightCm: z.number().min(1),
  quantity: z.number().min(1),
  unitPrice: currencySchema,
  artworkUrl: z.string().optional(),
})

export const quoteCreateFormSchema = z.object({
  clientName: requiredString('Cliente obrigatório.'),
  lines: z.array(lineSchema).min(1, 'Adicione pelo menos um item.'),
})

export type QuoteCreateFormInput = z.infer<typeof quoteCreateFormSchema>
