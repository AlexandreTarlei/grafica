import { z } from 'zod'

export const orderStatusChangeSchema = z.object({
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'enviado', 'entregue', 'cancelado']),
  nota: z.string().max(500).optional(),
})

export type OrderStatusChangeValues = z.infer<typeof orderStatusChangeSchema>
