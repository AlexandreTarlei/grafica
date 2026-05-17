import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardSnapshot } from '@/modules/dashboard/types'
import { formatCurrencyEUR, formatNumberPt } from '@/modules/financial/utils/format'

type QuickSummaryWidgetProps = {
  data?: DashboardSnapshot | null
  loading?: boolean
}

export function QuickSummaryWidget({ data, loading }: QuickSummaryWidgetProps) {
  return (
    <Card className="shadow-card ring-1 ring-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Resumo rápido</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : data ? (
          <ul className="text-muted-foreground space-y-2.5 text-sm">
            <li className="flex justify-between gap-2">
              <span>Faturamento no período</span>
              <span className="text-foreground font-medium tabular-nums">
                {formatCurrencyEUR(data.revenue)}
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Pedidos processados</span>
              <span className="text-foreground font-medium tabular-nums">{formatNumberPt(data.pedidos)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Contratos ativos</span>
              <span className="text-foreground font-medium tabular-nums">{formatNumberPt(data.contratos)}</span>
            </li>
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">Sem dados para o período.</p>
        )}
      </CardContent>
    </Card>
  )
}
