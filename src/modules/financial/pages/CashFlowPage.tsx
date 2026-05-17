import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { CashFlowChart } from '@/modules/financial/charts/CashFlowChart'
import type { CashFlowPoint } from '@/modules/financial/types'
import { useCashFlowSeries } from '@/modules/financial/hooks/useCashFlowSeries'
import { useFinancialPeriod } from '@/modules/financial/hooks/useFinancialPeriod'
import { formatCurrencyEUR } from '@/modules/financial/utils/format'
import { ChartCard } from '@/modules/financial/widgets/ChartCard'
import { FinancialErrorState } from '@/modules/financial/widgets/FinancialErrorState'
import { FinancialPageShell } from '@/modules/financial/widgets/FinancialPageShell'

export function CashFlowPage() {
  const { period, setPeriod, periodInvalid } = useFinancialPeriod()
  const cashQ = useCashFlowSeries(period)
  const tail = cashQ.data?.slice(-10) ?? []

  const columns = useMemo<ColumnDef<CashFlowPoint>[]>(
    () => [
      { accessorKey: 'date', header: 'Data' },
      {
        accessorKey: 'entradas',
        header: () => <span className="block text-right">Entradas</span>,
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrencyEUR(Number(getValue()))}
          </span>
        ),
      },
      {
        accessorKey: 'saidas',
        header: () => <span className="block text-right">Saídas</span>,
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums">{formatCurrencyEUR(Number(getValue()))}</span>
        ),
      },
      {
        accessorKey: 'saldo',
        header: () => <span className="block text-right">Saldo</span>,
        cell: ({ getValue }) => (
          <span className="block text-right font-medium tabular-nums">{formatCurrencyEUR(Number(getValue()))}</span>
        ),
      },
    ],
    [],
  )

  return (
    <FinancialPageShell
      title="Fluxo de caixa"
      subtitle="Visualização de entradas, saídas e saldo ao longo do período."
      period={period}
      onPeriodChange={setPeriod}
      periodInvalid={periodInvalid}
    >
      <ChartCard
        title="Série temporal"
        loading={cashQ.isLoading}
        error={
          cashQ.isError ? (
            <FinancialErrorState error={cashQ.error} onRetry={() => void cashQ.refetch()} />
          ) : undefined
        }
      >
        {cashQ.data ? <CashFlowChart data={cashQ.data} /> : null}
      </ChartCard>

      <div>
        <h2 className="section-title mb-3 text-base">Últimos movimentos (amostra)</h2>
        <DataTable
          columns={columns}
          data={tail}
          loading={cashQ.isLoading}
          density="dense"
          getRowId={(r) => r.date}
          emptyState={{ title: 'Sem movimentos', description: 'Não há dados no período selecionado.' }}
        />
      </div>
    </FinancialPageShell>
  )
}
