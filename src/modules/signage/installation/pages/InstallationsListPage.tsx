import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format, isSameDay, startOfWeek, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { listInstallations, installationsKey } from '@/modules/signage/installation/services/installation.api'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { INSTALLATION_STATUS_LABELS } from '@/modules/signage/shared/components/status-labels'
import { cn } from '@/lib/utils'

export function InstallationsListPage() {
  const companyId = useCurrentCompanyId()
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  const { data = [], isLoading } = useQuery({
    queryKey: installationsKey(companyId),
    queryFn: () => listInstallations(companyId as number),
    enabled: companyId != null,
  })

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  return (
    <PageShell title="Instalações" subtitle="Agenda semanal por equipe e rota.">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          onClick={() => setWeekStart((d) => addDays(d, -7))}
        >
          Semana anterior
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
        >
          Hoje
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          onClick={() => setWeekStart((d) => addDays(d, 7))}
        >
          Próxima semana
        </button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground text-sm">A carregar…</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => {
            const dayItems = data.filter((a) => isSameDay(new Date(a.scheduledAt), day))
            return (
              <div key={day.toISOString()} className="bg-muted/20 border-border shadow-card min-h-[140px] rounded-xl border p-2 ring-1 ring-border/60">
                <p className="mb-2 text-xs font-semibold capitalize">
                  {format(day, 'EEE dd/MM', { locale: ptBR })}
                </p>
                <ul className="space-y-2">
                  {dayItems.map((item) => {
                    const meta = INSTALLATION_STATUS_LABELS[item.status]
                    return (
                      <li key={item.id}>
                        <Link
                          to={`/admin/signage/instalacoes/${item.id}`}
                          className="bg-card shadow-card hover:bg-muted/50 block rounded-lg border p-2 text-xs ring-1 ring-border/40 transition-colors"
                        >
                          <p className="font-medium">{item.clientName}</p>
                          <p className="text-muted-foreground truncate">{item.teamName}</p>
                          <StatusBadge label={meta?.label ?? item.status} tone={meta?.tone} className="mt-1" />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
