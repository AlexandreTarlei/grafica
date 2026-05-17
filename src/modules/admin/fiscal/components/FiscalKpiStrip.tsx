import { CircleAlert, CircleCheck, Clock, FileText, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SefazStatusBadge } from '@/modules/admin/fiscal/components/SefazStatusBadge'
import type { FiscalDashboardKpis } from '@/modules/admin/fiscal/types'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string
  value: string | number
  icon: typeof FileText
  hint?: string
}) {
  return (
    <Card className="gap-2 p-4">
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
          <Icon className="size-3.5" />
          {label}
        </div>
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
        {hint ? <div className="text-muted-foreground text-xs">{hint}</div> : null}
      </CardContent>
    </Card>
  )
}

type FiscalKpiStripProps = {
  kpis?: FiscalDashboardKpis
  loading?: boolean
}

export function FiscalKpiStrip({ kpis, loading }: FiscalKpiStripProps) {
  if (loading || !kpis) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <KpiCard label="Emitidas" value={kpis.emitidas} icon={CircleCheck} hint={`${kpis.total} no total`} />
      <KpiCard label="Pendentes" value={kpis.pendentes} icon={Clock} />
      <KpiCard label="Rejeitadas" value={kpis.rejeitadas} icon={CircleAlert} />
      <KpiCard label="Faturamento" value={formatMoney(kpis.faturamento)} icon={Wallet} hint="Notas emitidas" />
      <Card className="gap-2 p-4">
        <CardContent className="flex flex-col gap-2 p-0">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
            <FileText className="size-3.5" />
            Estado SEFAZ
          </div>
          <SefazStatusBadge status={kpis.sefazHealth} />
        </CardContent>
      </Card>
    </div>
  )
}
