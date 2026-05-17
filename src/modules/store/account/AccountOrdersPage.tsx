import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'
import { EmptyState } from '@/components/layout/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { listStoreOrders } from '@/modules/store/services/orders.api'
import { formatCurrency } from '@/modules/signage/shared/utils/format'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  processing: 'Em produção',
  shipped: 'Enviado',
  delivered: 'Entregue',
  canceled: 'Cancelado',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'secondary',
  paid: 'default',
  processing: 'default',
  shipped: 'outline',
  delivered: 'outline',
  canceled: 'destructive',
}

export function AccountOrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['account', 'orders'],
    queryFn: () => listStoreOrders({ skip: 0, limit: 20 }),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    )
  }

  const items = data?.items ?? []

  return (
    <div className="space-y-4">
      <h2 className="section-title">Meus pedidos</h2>
      {isError ? (
        <p className="text-muted-foreground text-sm">Não foi possível carregar os pedidos. Tente mais tarde.</p>
      ) : null}
      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sem pedidos"
          description="Quando fizer uma encomenda, o histórico aparecerá aqui."
          action={{ label: 'Ver produtos', to: '/produtos' }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((o) => (
            <li key={o.id}>
              <Card className="shadow-card ring-1 ring-border/60 transition-colors hover:ring-primary/30">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">#{o.numero}</p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(o.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: pt })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_VARIANT[o.status] ?? 'outline'}>
                      {STATUS_LABELS[o.status] ?? o.status}
                    </Badge>
                    <span className="text-sm font-semibold tabular-nums">{formatCurrency(o.total)}</span>
                    <Link
                      to={`/conta/pedidos/${o.id}`}
                      className="text-primary inline-flex items-center gap-0.5 text-sm font-medium hover:underline"
                    >
                      Ver detalhe <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
