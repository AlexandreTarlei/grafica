import { z } from 'zod'

/**
 * Espelha `InvoiceCancelRequest` no backend: justificativa entre 15 e 255 caracteres.
 * A validação fica no servidor; aqui é UX.
 */
export const cancelInvoiceSchema = z.object({
  justificativa: z
    .string()
    .trim()
    .min(15, 'Justificativa deve ter pelo menos 15 caracteres.')
    .max(255, 'Justificativa pode ter no máximo 255 caracteres.'),
})

export type CancelInvoiceValues = z.infer<typeof cancelInvoiceSchema>
