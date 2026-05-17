import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardSnapshot } from '@/modules/dashboard/types'

type GoalsWidgetProps = {
  data?: DashboardSnapshot | null
}

export function GoalsWidget({ data }: GoalsWidgetProps) {
  const target = 120_000
  const current = data?.revenue ?? 0
  const pct = Math.min(100, Math.round((current / target) * 100))
  const contractsPct = data ? Math.min(100, Math.round((data.contratos / 60) * 100)) : 0

  return (
    <Card className="shadow-card ring-1 ring-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Metas do mês</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Faturamento</span>
            <span className="font-medium tabular-nums">{pct}%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Novos contratos</span>
            <span className="font-medium tabular-nums">{contractsPct}%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${contractsPct}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
