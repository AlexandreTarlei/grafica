import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { DashboardAreaChart } from '@/modules/dashboard/charts/DashboardAreaChart'
import { DashboardBarChart } from '@/modules/dashboard/charts/DashboardBarChart'
import { DashboardChartCard } from '@/modules/dashboard/components/DashboardChartCard'
import { FINANCIAL_WIDGET_LABELS } from '@/modules/financial/config/widget-registry'
import { useCashFlowSeries } from '@/modules/financial/hooks/useCashFlowSeries'
import { useFinancialWidgetVisibility } from '@/modules/financial/hooks/useFinancialWidgetVisibility'
import { useFinancialPeriod } from '@/modules/financial/hooks/useFinancialPeriod'
import { useOrdersSeries } from '@/modules/financial/hooks/useOrdersSeries'
import { useRevenueSeries } from '@/modules/financial/hooks/useRevenueSeries'
import { useSalesSeries } from '@/modules/financial/hooks/useSalesSeries'
import type { FinancialGranularity } from '@/modules/financial/types'
import { ExecutiveKpiStrip } from '@/modules/financial/widgets/ExecutiveKpiStrip'
import { FinancialErrorState } from '@/modules/financial/widgets/FinancialErrorState'
import { FinancialPageShell } from '@/modules/financial/widgets/FinancialPageShell'
import { cn } from '@/lib/utils'

export function FinancialDashboardPage() {
  const isWidget = useFinancialWidgetVisibility()
  const { period, setPeriod, periodInvalid } = useFinancialPeriod()
  const [granularity, setGranularity] = useState<FinancialGranularity>('day')

  const salesQ = useSalesSeries(period, granularity)
  const cashQ = useCashFlowSeries(period)
  const ordersQ = useOrdersSeries(period)
  const revenueQ = useRevenueSeries(period)

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
    <FinancialPageShell
      title="Financeiro"
      subtitle="Indicadores e gráficos por período."
      period={period}
      onPeriodChange={setPeriod}
      periodInvalid={periodInvalid}
    >
      {isWidget('kpis') ? (
        <ExecutiveKpiStrip period={period} description="Indicadores principais do negócio." />
      ) : null}

      {isWidget('chartSales') ? (
        <DashboardChartCard
          title={FINANCIAL_WIDGET_LABELS.chartSales}
          description="Tendência de vendas"
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
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {isWidget('chartCashFlow') ? (
          <DashboardChartCard
            title={FINANCIAL_WIDGET_LABELS.chartCashFlow}
            description="Entradas, saídas e saldo acumulado."
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
        ) : null}

        {isWidget('chartOrders') ? (
          <DashboardChartCard
            title={FINANCIAL_WIDGET_LABELS.chartOrders}
            description="Volume de pedidos por dia."
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
        ) : null}

        {isWidget('chartRevenue') ? (
          <DashboardChartCard
            title={FINANCIAL_WIDGET_LABELS.chartRevenue}
            description="Faturamento diário estimado."
            className="lg:col-span-2"
            loading={revenueQ.isLoading}
            error={
              revenueQ.isError ? (
                <FinancialErrorState error={revenueQ.error} onRetry={() => void revenueQ.refetch()} />
              ) : undefined
            }
          >
            {revenueQ.data ? (
              <DashboardAreaChart data={revenueQ.data} color="var(--chart-2)" />
            ) : null}
          </DashboardChartCard>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Link to="/admin/financeiro/fluxo-caixa" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          Fluxo de caixa
        </Link>
        <Link
          to="/admin/financeiro/contas-receber"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Contas a receber
        </Link>
        <Link to="/admin/financeiro/relatorios" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          Relatórios
        </Link>
      </div>
    </FinancialPageShell>
  )
}
