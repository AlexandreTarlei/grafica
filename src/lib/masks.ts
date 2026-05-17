export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskCnpj(value: string): string {
  const d = digitsOnly(value).slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function maskPhonePt(value: string): string {
  const d = digitsOnly(value).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
}

export function maskPostalCodePt(value: string): string {
  const d = digitsOnly(value).slice(0, 7)
  if (d.length <= 4) return d
  return `${d.slice(0, 4)}-${d.slice(4)}`
}

export function parseCurrencyInput(value: string): number {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  const n = Number.parseFloat(normalized)
  return Number.isFinite(n) ? n : 0
}

export function formatCurrencyInput(value: number, locale = 'pt-BR'): string {
  if (!Number.isFinite(value) || value === 0) return ''
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
