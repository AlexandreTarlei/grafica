import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReportSummary } from '@/modules/financial/types'
import { formatCurrencyEUR, formatNumberPt } from '@/modules/financial/utils/format'

type ReportsSummaryPanelProps = {
  report: ReportSummary
}

export function ReportsSummaryPanel({ report }: ReportsSummaryPanelProps) {
  const categoryColumns = useMemo<ColumnDef<ReportSummary['porCategoria'][number]>[]>(
    () => [
      { accessorKey: 'categoria', header: 'Categoria', cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span> },
      {
        accessorKey: 'valor',
        header: () => <span className="block text-right">Valor</span>,
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums">{formatCurrencyEUR(Number(getValue()))}</span>
        ),
      },
      {
        accessorKey: 'percentagem',
        header: () => <span className="block text-right">%</span>,
        cell: ({ getValue }) => <span className="block text-right tabular-nums">{Number(getValue())}%</span>,
      },
    ],
    [],
  )

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="shadow-card ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="text-base">Resumo do período</CardTitle>
          <CardDescription>
            {report.periodo.from} a {report.periodo.to}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Faturamento</span>
            <span className="font-medium tabular-nums">{formatCurrencyEUR(report.totalFaturamento)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Lucro</span>
            <span className="font-medium tabular-nums">{formatCurrencyEUR(report.totalLucro)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Pedidos</span>
            <span className="font-medium tabular-nums">{formatNumberPt(report.totalPedidos)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Ticket médio</span>
            <span className="font-medium tabular-nums">{formatCurrencyEUR(report.ticketMedio)}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-card ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="text-base">Por categoria</CardTitle>
          <CardDescription>Distribuição estimada no período.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <DataTable
            columns={categoryColumns}
            data={report.porCategoria}
            density="dense"
            getRowId={(r) => r.categoria}
            className="rounded-none border-0 shadow-none ring-0"
            emptyState={{ title: 'Sem categorias', description: 'Sem dados agregados.' }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
