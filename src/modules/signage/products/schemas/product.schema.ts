import { z } from 'zod'
import { SIGNAGE_PRODUCT_CATEGORIES } from '@/modules/signage/products/types'
import { currencySchema, requiredString } from '@/lib/validation/common'

const categoryEnum = z.enum(SIGNAGE_PRODUCT_CATEGORIES)

export const signageProductFormSchema = z.object({
  name: requiredString('Nome obrigatório.'),
  sku: requiredString('SKU obrigatório.'),
  salePrice: currencySchema,
  active: z.boolean(),
  categoryId: z.number().nullable(),
  metadata: z.object({
    category: categoryEnum,
    widthCm: z.number().min(1, 'Largura inválida.'),
    heightCm: z.number().min(1, 'Altura inválida.'),
    depthCm: z.number().optional(),
    materialsText: z.string().optional(),
    finishesText: z.string().optional(),
    artworkUrl: z.string().optional(),
    dynamicPricing: z.boolean().optional(),
  }),
})

export type SignageProductFormInput = z.infer<typeof signageProductFormSchema>
