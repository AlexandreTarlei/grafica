import { z } from 'zod'

const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD')

export const financialPeriodQuerySchema = z
  .object({
    from: dateStr,
    to: dateStr,
  })
  .refine(
    (v) => {
      const a = new Date(`${v.from}T00:00:00`)
      const b = new Date(`${v.to}T00:00:00`)
      return a.getTime() <= b.getTime()
    },
    { message: 'A data inicial não pode ser posterior à final.', path: ['to'] },
  )

export type FinancialPeriodQuery = z.infer<typeof financialPeriodQuerySchema>
