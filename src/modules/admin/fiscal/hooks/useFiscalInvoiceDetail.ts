import { useQuery } from '@tanstack/react-query'
import { env } from '@/core/env'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { getInvoice } from '@/modules/admin/fiscal/services/fiscal.api'
import type { FiscalInvoiceDetail } from '@/modules/admin/fiscal/types'

export function fiscalInvoiceDetailQueryKey(companyId: number | null, invoiceId: number | null) {
  return ['admin', 'fiscal', 'invoices', 'detail', companyId, invoiceId] as const
}

/**
 * Detalhe duma nota. Faz polling adaptativo (3s) enquanto a nota está em estado
 * transitório (`processando` ou `pendente`) — devolve estado final assim que o
 * worker do backend processa a emissão.
 */
export function useFiscalInvoiceDetail(invoiceId: number | undefined) {
  const companyId = useCurrentCompanyId()
  const id = invoiceId ?? null
  return useQuery({
    queryKey: fiscalInvoiceDetailQueryKey(companyId, id),
    queryFn: () => getInvoice(companyId as number, id as number),
    enabled: companyId != null && id != null,
    refetchInterval: (query) => {
      if (env.realtimeEnabled) return false
      const data = query.state.data as FiscalInvoiceDetail | undefined
      if (data && (data.status === 'processando' || data.status === 'pendente')) {
        return 3_000
      }
      return false
    },
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  })
}
