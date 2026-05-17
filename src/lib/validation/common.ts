import { z } from 'zod'

export const emailSchema = z.string().email('E-mail inválido.')

export const phoneSchema = z.string().min(6, 'Telefone inválido.')

export const postalCodeSchema = z.string().min(4, 'Código postal obrigatório.')

export const currencySchema = z.number().min(0, 'Valor inválido.')

export const cnpjDigits = (v: string) => v.replace(/\D/g, '')

export const cnpjSchema = z
  .string()
  .min(1, 'CNPJ obrigatório.')
  .refine((v) => {
    const d = cnpjDigits(v)
    return d.length === 14
  }, 'CNPJ deve ter 14 dígitos.')

export const requiredString = (msg: string) => z.string().min(1, msg)
