/**
 * Resolução futura de tenant por domínio (white-label).
 *
 * Backend sugerido: GET /tenants/resolve?host=loja.cliente.com
 *
 * No browser, apenas lemos o hostname público; o mapeamento real deve vir da API.
 */

export function readPublicHostname(): string {
  if (typeof window === 'undefined') return ''
  return window.location.hostname.toLowerCase()
}

/** Devolve `null` até existir API de resolução; opcionalmente use env em dev. */
export function resolveTenantIdFromHost(): string | null {
  const raw = import.meta.env.VITE_PUBLIC_HOST_MAP?.trim()
  if (!raw) return null
  try {
    const map = JSON.parse(raw) as Record<string, string>
    const host = readPublicHostname()
    const id = map[host]
    return typeof id === 'string' && id.length > 0 ? id : null
  } catch {
    return null
  }
}
