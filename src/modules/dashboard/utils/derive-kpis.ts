import type { SignageOperationalDashboard } from '@/modules/signage/dashboard/services/signage-dashboard.api'
import type { FinancialKpis } from '@/modules/financial/types'
import type { DashboardSnapshot } from '@/modules/dashboard/types'

export function deriveKpisFromSignage(
  financial: FinancialKpis,
  signage?: SignageOperationalDashboard | null,
): Pick<DashboardSnapshot, 'contratos' | 'locacoes' | 'produtos' | 'estoqueTotal'> {
  const approvedQuotes =
    signage?.quotesByStatus?.find((q) => q.status.toLowerCase().includes('aprov'))?.count ?? 0
  const contratos =
    financial.contratos ??
    Math.max(0, Math.round(approvedQuotes + (signage?.pendingQuotes ?? 0) * 0.6))

  const funnelInstall =
    signage?.productionFunnel?.find((f) => f.stage.toLowerCase().includes('instal'))?.count ?? 0
  const locacoes =
    financial.locacoes ??
    Math.max(0, (signage?.installationsToday ?? 0) + funnelInstall)

  const produtos =
    financial.produtos ??
    Math.max(
      24,
      (signage?.productionFunnel?.reduce((s, f) => s + f.count, 0) ?? 0) * 3 + 12,
    )

  const estoqueTotal =
    financial.estoqueTotal ?? Math.max(financial.estoqueBaixo * 8, financial.estoqueBaixo + 120)

  return {
    contratos: Math.round(contratos),
    locacoes: Math.round(locacoes),
    produtos: Math.round(produtos),
    estoqueTotal: Math.round(estoqueTotal),
  }
}

export function mergeDashboardSnapshot(
  financial: FinancialKpis,
  signage?: SignageOperationalDashboard | null,
  fluxoLiquido?: number,
): DashboardSnapshot {
  const derived = deriveKpisFromSignage(financial, signage)
  return {
    ...financial,
    ...derived,
    fluxoLiquido: financial.fluxoLiquido ?? fluxoLiquido ?? 0,
  }
}
