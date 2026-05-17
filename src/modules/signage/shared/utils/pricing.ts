import type { SignageProductCategory } from '@/modules/signage/products/types'

export type QuoteLineInput = {
  category: SignageProductCategory
  widthCm: number
  heightCm: number
  quantity: number
  unitPrice?: number
  materialCost?: number
  finishCost?: number
  discountPercent?: number
}

const AREA_RATE: Partial<Record<SignageProductCategory, number>> = {
  banner: 0.08,
  lona: 0.06,
  fachada: 0.12,
  acm: 0.18,
  adesivo: 0.1,
  cartao: 0.25,
  envelopamento: 0.15,
  wind_banner: 0.09,
  luminoso: 0.22,
  letra_caixa: 0.2,
  brindes: 0.35,
}

export function calculateLineSubtotal(line: QuoteLineInput): number {
  const areaM2 = (line.widthCm / 100) * (line.heightCm / 100)
  const rate = AREA_RATE[line.category] ?? 0.1
  const base = line.unitPrice ?? areaM2 * rate * 1000
  const material = line.materialCost ?? 0
  const finish = line.finishCost ?? 0
  const unit = base + material + finish
  const gross = unit * Math.max(1, line.quantity)
  const discount = (line.discountPercent ?? 0) / 100
  return Math.round(gross * (1 - discount) * 100) / 100
}

export function calculateQuoteTotals(
  lines: QuoteLineInput[],
  options?: { taxPercent?: number; globalDiscountPercent?: number },
): {
  subtotal: number
  tax: number
  discount: number
  total: number
} {
  const subtotal = lines.reduce((sum, line) => sum + calculateLineSubtotal(line), 0)
  const globalDiscount = ((options?.globalDiscountPercent ?? 0) / 100) * subtotal
  const afterDiscount = subtotal - globalDiscount
  const tax = (afterDiscount * (options?.taxPercent ?? 0)) / 100
  const total = Math.round((afterDiscount + tax) * 100) / 100
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(globalDiscount * 100) / 100,
    total,
  }
}
