import { useQuery } from '@tanstack/react-query'
import { listReceivables } from '@/modules/financial/services/financial.api'
import type { ReceivablesListParams } from '@/modules/financial/types'

export function useReceivables(params: ReceivablesListParams) {
  return useQuery({
    queryKey: [
      'admin',
      'financial',
      'receivables',
      params.skip,
      params.limit,
      params.status ?? '',
      params.search ?? '',
      params.dueBefore ?? '',
    ],
    queryFn: () => listReceivables(params),
    placeholderData: (prev) => prev,
  })
}
