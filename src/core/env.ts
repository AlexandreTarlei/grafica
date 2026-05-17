function readOptionalPositiveInt(raw: string | undefined): number | null {
  if (!raw?.trim()) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null
}

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  appName: import.meta.env.VITE_APP_NAME ?? 'SaaS',
  /** ID da empresa na API (path `/companies/{id}/...`). Opcional: senão usa tenant numérico ou 1. */
  companyId: readOptionalPositiveInt(import.meta.env.VITE_COMPANY_ID),
  /** ID de tenant só para desenvolvimento quando não há valor em sessão. */
  defaultTenantId: import.meta.env.VITE_DEFAULT_TENANT_ID?.trim() ?? '',
  /** Segmento de negócio (`retail` | `services` | `wholesale`); inválido → tratado como retail no módulo financeiro. */
  businessSegment: import.meta.env.VITE_BUSINESS_SEGMENT?.trim() ?? '',
  /** `signage` — copy e landing orientados a envelopamento, placas e lonas (demo comercial). */
  commercialVertical: (() => {
    const raw = import.meta.env.VITE_COMMERCIAL_VERTICAL?.trim().toLowerCase() ?? ''
    return raw === 'signage' ? 'signage' : ''
  })(),
  /** mock | asaas — subscrição SaaS (área comercial); mock por defeito. */
  billingProvider: (import.meta.env.VITE_BILLING_PROVIDER ?? 'mock').toLowerCase(),
  /** WhatsApp comercial (apenas dígitos, ex.: 351912345678). */
  whatsappPhone: import.meta.env.VITE_WHATSAPP_PHONE?.trim() ?? '',
  realtimeEnabled: import.meta.env.VITE_REALTIME_ENABLED === 'true',
} as const
