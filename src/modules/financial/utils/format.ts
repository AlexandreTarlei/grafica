export function formatCurrencyEUR(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

export function formatNumberPt(value: number): string {
  return new Intl.NumberFormat('pt-PT').format(value)
}
