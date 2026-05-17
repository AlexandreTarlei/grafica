import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { listInvoices } from '@/modules/admin/fiscal/services/fiscal.api'
import type { FiscalInvoiceListParams } from '@/modules/admin/fiscal/types'

export function fiscalInvoicesListQueryKey(companyId: number | null, params: FiscalInvoiceListParams) {
  return ['admin', 'fiscal', 'invoices', 'list', companyId, params] as const
}

export function useFiscalInvoicesList(params: FiscalInvoiceListParams) {
  const companyId = useCurrentCompanyId()
  return useQuery({
    queryKey: fiscalInvoicesListQueryKey(companyId, params),
    queryFn: () => listInvoices(companyId as number, params),
    enabled: companyId != null,
    staleTime: 30_000,
  })
}
