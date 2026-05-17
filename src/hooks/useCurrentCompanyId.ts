import { useTenant } from '@/contexts/TenantContext'

/**
 * Devolve o `company_id` numérico esperado pelo backend
 * (rotas `/companies/{company_id}/...`).
 *
 * Implementação atual: faz parse de `tenant.id` (de {@link useTenant}) como número.
 * Suposição: o `tenantId` armazenado é numérico e corresponde a `company_id`.
 *
 * Quando o JWT/`AuthUser` passar a expor `companyId` explicitamente,
 * basta trocar a fonte aqui sem alterar consumidores.
 */
export function useCurrentCompanyId(): number | null {
  const { tenant } = useTenant()
  if (!tenant?.id) return null
  const n = Number(tenant.id)
  return Number.isFinite(n) && n > 0 ? n : null
}
