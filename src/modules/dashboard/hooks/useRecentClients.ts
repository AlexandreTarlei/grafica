import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { listCorporateClients } from '@/modules/signage/clients/services/customers.api'
import type { RecentTableRow } from '@/modules/dashboard/types'

export function useRecentClients() {
  const companyId = useCurrentCompanyId()
  const q = useQuery({
    queryKey: ['dashboard', 'recent-clients', companyId],
    queryFn: () => listCorporateClients(companyId as number, ''),
    enabled: companyId != null,
    staleTime: 60_000,
  })

  const rows: RecentTableRow[] = (q.data ?? []).slice(0, 8).map((c) => ({
    id: c.id,
    primary: c.legalName,
    secondary: c.cnpj,
    status: c.recurring ? 'Recorrente' : 'Pontual',
    statusTone: c.recurring ? 'success' : 'default',
    href: '/admin/crm',
  }))

  return { ...q, rows }
}
