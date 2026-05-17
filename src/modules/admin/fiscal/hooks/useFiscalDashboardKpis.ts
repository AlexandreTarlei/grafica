import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { listInvoices } from '@/modules/admin/fiscal/services/fiscal.api'
import { useFiscalSettings } from '@/modules/admin/fiscal/hooks/useFiscalSettings'
import type {
  FiscalDashboardKpis,
  FiscalInvoiceListItem,
  FiscalSettings,
} from '@/modules/admin/fiscal/types'

const KPI_PAGE_SIZE = 200

function aggregate(items: FiscalInvoiceListItem[], settings: FiscalSettings | undefined): FiscalDashboardKpis {
  const counts = { emitidas: 0, pendentes: 0, rejeitadas: 0, canceladas: 0 }
  let faturamento = 0
  for (const it of items) {
    if (it.status === 'emitida') counts.emitidas += 1
    else if (it.status === 'pendente' || it.status === 'processando') counts.pendentes += 1
    else if (it.status === 'rejeitada') counts.rejeitadas += 1
    else if (it.status === 'cancelada' || it.status === 'inutilizada') counts.canceladas += 1
    if (it.status === 'emitida' && typeof it.valorTotal === 'number') {
      faturamento += it.valorTotal
    }
  }

  const total = items.length
  let sefazHealth: FiscalDashboardKpis['sefazHealth'] = 'unknown'
  if (settings) {
    if (!settings.providerTokenConfigured) {
      sefazHealth = 'offline'
    } else if (settings.environment !== 'production') {
      sefazHealth = 'homologation'
    } else {
      const denom = counts.emitidas + counts.rejeitadas
      const rejectionRate = denom > 0 ? counts.rejeitadas / denom : 0
      sefazHealth = rejectionRate > 0.2 ? 'degraded' : 'operational'
    }
  }

  return {
    total,
    emitidas: counts.emitidas,
    pendentes: counts.pendentes,
    rejeitadas: counts.rejeitadas,
    canceladas: counts.canceladas,
    faturamento,
    sefazHealth,
  }
}

/**
 * KPIs do painel fiscal — agregados client-side a partir das últimas N notas
 * (sem endpoint dedicado). Limitação: amostra `KPI_PAGE_SIZE` registos mais
 * recentes; ao implementar `/companies/{id}/fiscal/dashboard` no backend,
 * trocar esta lógica por uma única chamada agregada.
 */
export function useFiscalDashboardKpis() {
  const companyId = useCurrentCompanyId()
  const settings = useFiscalSettings()

  return useQuery({
    queryKey: ['admin', 'fiscal', 'dashboard', 'kpis', companyId, settings.data?.environment ?? null],
    queryFn: async () => {
      const res = await listInvoices(companyId as number, {
        page: 1,
        pageSize: KPI_PAGE_SIZE,
        search: '',
        status: '',
        dateFrom: '',
        dateTo: '',
      })
      return aggregate(res.items, settings.data)
    },
    enabled: companyId != null,
    staleTime: 60_000,
  })
}
