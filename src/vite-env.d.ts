/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME?: string
  /** UUID ou slug do tenant pré-preenchido em dev (sem sessão). */
  readonly VITE_DEFAULT_TENANT_ID?: string
  /** `false` força API real; omisso ou outro valor mantém mock em dev. */
  readonly VITE_USE_ORDER_MOCK?: string
  readonly VITE_USE_CART_MOCK?: string
  readonly VITE_USE_CHECKOUT_MOCK?: string
  readonly VITE_USE_FINANCIAL_MOCK?: string
  /** `true` ativa mocks locais para o módulo Fiscal (NF-e); default: API real. */
  readonly VITE_USE_FISCAL_MOCK?: string
  /** retail | services | wholesale — filtra widgets do dashboard financeiro. */
  readonly VITE_BUSINESS_SEGMENT?: string
  /** signage — demonstração comercial (wrap, placas, lonas). */
  readonly VITE_COMMERCIAL_VERTICAL?: string
  readonly VITE_USE_TENANT_BOOTSTRAP_MOCK?: string
  /** JSON opcional: mapa hostname → tenantId para dev (`{"localhost":"uuid"}`). */
  readonly VITE_PUBLIC_HOST_MAP?: string
  readonly VITE_USE_AUTOMATIONS_MOCK?: string
  readonly VITE_USE_REPORTS_MOCK?: string
  readonly VITE_USE_ANALYTICS_MOCK?: string
  /** Área comercial: `false` força API real quando existir. */
  readonly VITE_USE_COMMERCIAL_MOCK?: string
  /** mock | asaas — billing subscrição SaaS. */
  readonly VITE_BILLING_PROVIDER?: string
  readonly VITE_USE_SIGNAGE_DASHBOARD_MOCK?: string
  readonly VITE_USE_SIGNAGE_PRODUCTS_MOCK?: string
  readonly VITE_USE_SIGNAGE_QUOTES_MOCK?: string
  readonly VITE_USE_SIGNAGE_PRODUCTION_MOCK?: string
  readonly VITE_USE_SIGNAGE_INSTALLATION_MOCK?: string
  readonly VITE_USE_SIGNAGE_CUSTOMERS_MOCK?: string
  readonly VITE_USE_SIGNAGE_RESALE_MOCK?: string
  readonly VITE_WHATSAPP_PHONE?: string
  readonly VITE_COMPANY_ID?: string
  readonly VITE_VISUAL_MAX_UPLOAD_MB?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
