/** Chaves de persistência no sessionStorage (auth) */
export const STORAGE_KEYS = {
  accessToken: 'saas_access_token',
  refreshToken: 'saas_refresh_token',
  user: 'saas_user',
} as const

/** Tamanho máximo de upload (MB) — alinhado com VISUAL_MAX_UPLOAD_MB do backend. */
export const MAX_UPLOAD_BYTES =
  (Number(import.meta.env.VITE_VISUAL_MAX_UPLOAD_MB) || 25) * 1024 * 1024

/** Chave do tenant atual (multiempresa) */
export const TENANT_STORAGE_KEY = 'saas_tenant_id'

/** Preferência de tema (localStorage) */
export const THEME_STORAGE_KEY = 'saas_theme'
