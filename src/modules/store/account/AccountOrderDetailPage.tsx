import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Package } from 'lucide-react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { EmptyState } from '@/components/layout/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { formatCurrency } from '@/modules/signage/shared/utils/format'
import {
  getStoreOrder,
  storeOrderDetailKey,
  type StoreOrderLine,
} from '@/modules/store/services/orders.api'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  processing: 'Em produção',
  shipped: 'Enviado',
  delivered: 'Entregue',
  canceled: 'Cancelado',
}

export function AccountOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data, isLoading, isError } = useQuery({
    queryKey: storeOrderDetailKey(orderId ?? ''),
    queryFn: () => getStoreOrder(orderId!),
    enabled: Boolean(orderId),
  })

  const columns = useMemo<ColumnDef<StoreOrderLine>[]>(
    () => [
      {
        accessorKey: 'productName',
        header: 'Produto',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.productName}</p>
            {row.original.sku ? (
              <p className="text-muted-foreground text-xs">{row.original.sku}</p>
            ) : null}
          </div>
        ),
      },
      {
        id: 'dims',
        header: 'Medidas',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ row }) => {
          const { widthCm, heightCm } = row.original
          if (widthCm == null || heightCm == null) return '—'
          return `${widthCm} × ${heightCm} cm`
        },
      },
      {
        accessorKey: 'quantity',
        header: () => <span className="block text-right">Qtd</span>,
        cell: ({ getValue }) => <span className="block text-right tabular-nums">{Number(getValue())}</span>,
      },
      {
        accessorKey: 'subtotal',
        header: () => <span className="block text-right">Subtotal</span>,
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums font-medium">
            {formatCurrency(Number(getValue()))}
          </span>
        ),
      },
    ],
    [],
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={Package}
        title="Pedido não encontrado"
        description="Verifique o identificador ou volte à lista."
        action={{ label: 'Meus pedidos', to: '/conta/pedidos' }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/conta/pedidos"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>
        <h2 className="section-title">Pedido #{data.numero}</h2>
      </div>

      <Card className="shadow-card ring-1 ring-border/60">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-2">
          <CardTitle className="text-base">Resumo</CardTitle>
          <Badge>{STATUS_LABELS[data.status] ?? data.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            {format(new Date(data.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: pt })}
          </p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrency(data.total)}</p>
          {data.shippingAddress ? (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Envio: </span>
              {data.shippingAddress}
            </p>
          ) : null}
          {data.notes ? (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Notas: </span>
              {data.notes}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Itens</h3>
        <DataTable
          columns={columns}
          data={data.items}
          getRowId={(r) => r.id}
          density="dense"
          emptyState={{
            title: 'Sem itens',
            description: 'Este pedido não tem linhas detalhadas.',
          }}
        />
      </div>

      <Button type="button" variant="outline" render={<Link to="/conta/producao" />} nativeButton={false}>
        Ver estado de produção
      </Button>
    </div>
  )
}
