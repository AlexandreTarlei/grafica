import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { DashboardAreaChart } from '@/modules/dashboard/charts/DashboardAreaChart'
import { DashboardBarChart } from '@/modules/dashboard/charts/DashboardBarChart'
import { DashboardComboChart } from '@/modules/dashboard/charts/DashboardComboChart'
import { DashboardChartCard } from '@/modules/dashboard/components/DashboardChartCard'
import { useCashFlowSeries } from '@/modules/financial/hooks/useCashFlowSeries'
import { useOrdersSeries } from '@/modules/financial/hooks/useOrdersSeries'
import { useRevenueSeries } from '@/modules/financial/hooks/useRevenueSeries'
import { useSalesSeries } from '@/modules/financial/hooks/useSalesSeries'
import type { FinancialGranularity, FinancialPeriod } from '@/modules/financial/types'
import { FinancialErrorState } from '@/modules/financial/widgets/FinancialErrorState'
import {
  fetchSignageDashboard,
  signageDashboardKey,
} from '@/modules/signage/dashboard/services/signage-dashboard.api'
import { cn } from '@/lib/utils'

type DashboardChartsSectionProps = {
  period: FinancialPeriod
}

export function DashboardChartsSection({ period }: DashboardChartsSectionProps) {
  const [granularity, setGranularity] = useState<FinancialGranularity>('day')
  const { isModuleEnabled } = useTenantPlatform()
  const companyId = useCurrentCompanyId()
  const signageEnabled = isModuleEnabled('signage')

  const salesQ = useSalesSeries(period, granularity)
  const revenueQ = useRevenueSeries(period)
  const ordersQ = useOrdersSeries(period)
  const cashQ = useCashFlowSeries(period)

  const signageQ = useQuery({
    queryKey: signageDashboardKey(companyId),
    queryFn: () => fetchSignageDashboard(companyId as number),
    enabled: companyId != null && signageEnabled,
    staleTime: 60_000,
  })

  const funnelData =
    signageQ.data?.productionFunnel.map((f) => ({ label: f.stage, value: f.count })) ?? []

  const granularityTabs = (
    <div className="bg-muted flex rounded-lg p-0.5 text-xs">
      {(['day', 'week', 'month'] as const).map((g) => (
        <button
          key={g}
          type="button"
          className={cn(
            'rounded-md px-2.5 py-1 capitalize transition-base',
            granularity === g ? 'bg-background shadow-sm' : 'text-muted-foreground',
          )}
          onClick={() => setGranularity(g)}
        >
          {g === 'day' ? 'Dia' : g === 'week' ? 'Semana' : 'Mês'}
        </button>
      ))}
    </div>
  )

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <DashboardChartCard
        className="lg:col-span-8"
        title="Vendas"
        description="Tendência no período selecionado"
        loading={salesQ.isLoading}
        headerExtra={granularityTabs}
        error={
          salesQ.isError ? (
            <FinancialErrorState error={salesQ.error} onRetry={() => void salesQ.refetch()} />
          ) : undefined
        }
      >
        {salesQ.data ? <DashboardAreaChart data={salesQ.data} /> : null}
      </DashboardChartCard>

      <DashboardChartCard
        className="lg:col-span-4"
        title="Crescimento"
        description="Variação vs dia anterior"
        loading={revenueQ.isLoading}
        error={
          revenueQ.isError ? (
            <FinancialErrorState error={revenueQ.error} onRetry={() => void revenueQ.refetch()} />
          ) : undefined
        }
      >
        {revenueQ.data ? <DashboardComboChart data={revenueQ.data} /> : null}
      </DashboardChartCard>

      <DashboardChartCard
        className="lg:col-span-6"
        title="Faturamento"
        loading={revenueQ.isLoading}
        error={
          revenueQ.isError ? (
            <FinancialErrorState error={revenueQ.error} onRetry={() => void revenueQ.refetch()} />
          ) : undefined
        }
      >
        {revenueQ.data ? <DashboardAreaChart data={revenueQ.data} color="var(--chart-2)" /> : null}
      </DashboardChartCard>

      <DashboardChartCard
        className="lg:col-span-6"
        title="Pedidos"
        loading={ordersQ.isLoading}
        error={
          ordersQ.isError ? (
            <FinancialErrorState error={ordersQ.error} onRetry={() => void ordersQ.refetch()} />
          ) : undefined
        }
      >
        {ordersQ.data ? (
          <DashboardBarChart
            data={ordersQ.data.map((p) => ({ label: p.date.slice(5), value: p.value }))}
          />
        ) : null}
      </DashboardChartCard>

      {signageEnabled && funnelData.length > 0 ? (
        <DashboardChartCard
          className="lg:col-span-6"
          title="Locações / produção"
          description="Distribuição por etapa"
          loading={signageQ.isLoading}
        >
          <DashboardBarChart data={funnelData} color="var(--chart-4)" />
        </DashboardChartCard>
      ) : null}

      <DashboardChartCard
        className={signageEnabled && funnelData.length > 0 ? 'lg:col-span-6' : 'lg:col-span-12'}
        title="Fluxo de caixa"
        description="Saldo acumulado"
        loading={cashQ.isLoading}
        error={
          cashQ.isError ? (
            <FinancialErrorState error={cashQ.error} onRetry={() => void cashQ.refetch()} />
          ) : undefined
        }
      >
        {cashQ.data ? (
          <DashboardAreaChart
            data={cashQ.data.map((p) => ({ date: p.date, value: p.saldo }))}
            color="var(--chart-3)"
          />
        ) : null}
      </DashboardChartCard>
    </section>
  )
}
