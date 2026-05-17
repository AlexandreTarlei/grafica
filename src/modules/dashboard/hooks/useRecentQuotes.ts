import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { listQuotes } from '@/modules/signage/quotes/services/quotes.api'
import type { RecentTableRow } from '@/modules/dashboard/types'
import { formatCurrency } from '@/modules/signage/shared/utils/format'

const quoteStatusTone: Record<string, RecentTableRow['statusTone']> = {
  rascunho: 'default',
  enviado: 'info',
  aprovado: 'success',
  rejeitado: 'danger',
  convertido: 'success',
}

export function useRecentQuotes() {
  const companyId = useCurrentCompanyId()
  const q = useQuery({
    queryKey: ['dashboard', 'recent-quotes', companyId],
    queryFn: () => listQuotes(companyId as number, { page: 1, pageSize: 8 }),
    enabled: companyId != null,
    staleTime: 30_000,
  })

  const rows: RecentTableRow[] =
    q.data?.items.map((quote) => ({
      id: quote.id,
      primary: quote.number,
      secondary: quote.clientName,
      meta: formatCurrency(quote.total),
      status: quote.status,
      statusTone: quoteStatusTone[quote.status] ?? 'default',
      href: `/admin/signage/orcamentos/${quote.id}`,
    })) ?? []

  return { ...q, rows }
}
