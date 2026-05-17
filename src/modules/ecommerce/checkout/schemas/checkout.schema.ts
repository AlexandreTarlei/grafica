import { z } from 'zod'

export const checkoutSchema = z.object({
  nome: z.string().min(2, 'Indique o nome.'),
  email: z.string().email('E-mail inválido.'),
  telefone: z.string().min(6, 'Telefone inválido.'),
  morada: z.string().min(4, 'Morada obrigatória.'),
  cidade: z.string().min(2, 'Cidade obrigatória.'),
  codigoPostal: z.string().min(4, 'Código postal obrigatório.'),
  pais: z.string().min(2, 'País obrigatório.'),
  metodoEnvio: z.enum(['standard', 'express', 'levantamento'], {
    error: () => ({ message: 'Escolha um método de envio.' }),
  }),
  metodoPagamento: z.enum(['cartao', 'mbway', 'referencia'], {
    error: () => ({ message: 'Escolha um método de pagamento.' }),
  }),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
