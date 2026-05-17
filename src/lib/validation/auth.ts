import { z } from 'zod'
import { emailSchema } from '@/lib/validation/common'

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha obrigatória.'),
})

export const signUpFormSchema = z.object({
  full_name: z.string().min(2, 'Nome demasiado curto.'),
  email: emailSchema,
  password: z.string().min(8, 'Mínimo 8 caracteres.'),
  terms: z.boolean().refine((v) => v === true, { message: 'Aceite os termos para continuar.' }),
})

export type LoginFormInput = z.infer<typeof loginFormSchema>
export type SignUpFormInput = z.infer<typeof signUpFormSchema>
