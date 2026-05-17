import { AlertTriangle, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardSnapshot } from '@/modules/dashboard/types'
import { cn } from '@/lib/utils'

type AlertsWidgetProps = {
  data?: DashboardSnapshot | null
  operationalAlerts?: { label: string; tone: 'success' | 'warning' | 'danger' | 'info' }[]
}

export function AlertsWidget({ data, operationalAlerts = [] }: AlertsWidgetProps) {
  const alerts: { label: string; tone: 'warning' | 'danger' | 'info' }[] = []

  if (data && data.estoqueBaixo > 10) {
    alerts.push({ label: `${data.estoqueBaixo} SKUs com stock crítico`, tone: 'warning' })
  }
  operationalAlerts.forEach((o) => {
    if (o.tone === 'warning' || o.tone === 'danger') {
      alerts.push({ label: o.label, tone: o.tone })
    }
  })
  if (alerts.length === 0) {
    alerts.push({ label: 'Nenhum alerta crítico no momento', tone: 'info' })
  }

  return (
    <Card className="shadow-card ring-1 ring-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {alerts.map((a, i) => (
            <li
              key={i}
              className={cn(
                'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
                a.tone === 'warning' && 'border-amber-500/30 bg-amber-500/5',
                a.tone === 'danger' && 'border-rose-500/30 bg-rose-500/5',
                a.tone === 'info' && 'border-border bg-muted/30',
              )}
            >
              {a.tone === 'danger' ? (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-500" />
              ) : (
                <Package className="mt-0.5 size-4 shrink-0 text-amber-500" />
              )}
              <span>{a.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
