import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { PRODUCTION_STAGE_LABELS } from '@/modules/signage/shared/components/status-labels'
import { listProductionJobs } from '@/modules/store/services/production.api'

export function AccountProductionPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['account', 'production'],
    queryFn: () => listProductionJobs({ limit: 20 }),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  const jobs = data ?? []

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Rastreamento de produção</h2>
      <p className="text-muted-foreground text-sm">
        Acompanhe o estado dos seus trabalhos em produção.
      </p>
      {isError ? (
        <p className="text-muted-foreground text-sm">Não foi possível carregar a produção.</p>
      ) : null}
      {jobs.length === 0 ? (
        <p className="text-muted-foreground text-sm">Sem trabalhos em produção no momento.</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => {
            const meta = PRODUCTION_STAGE_LABELS[job.status as keyof typeof PRODUCTION_STAGE_LABELS]
            return (
              <li
                key={job.id}
                className="border-border flex items-center justify-between rounded-lg border p-4"
              >
                <span className="text-sm font-medium">
                  Trabalho #{job.id}
                  {job.orderId ? ` · Pedido ${job.orderId}` : ''}
                </span>
                <StatusBadge label={meta?.label ?? job.status} tone={meta?.tone} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
