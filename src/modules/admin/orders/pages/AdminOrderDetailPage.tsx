import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import type { AdminOrderLine } from '@/modules/admin/orders/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PERMISSIONS } from '@/core/types/permissions'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { usePermissions } from '@/hooks/usePermissions'
import { OrderFiscalCard } from '@/modules/admin/fiscal/components/OrderFiscalCard'
import { AdminOrderStatusBadge } from '@/modules/admin/orders/components/AdminOrderStatusBadge'
import { AdminOrderStatusDialog } from '@/modules/admin/orders/components/AdminOrderStatusDialog'
import { useAdminOrderDetail } from '@/modules/admin/orders/hooks/useAdminOrderDetail'
import { useUpdateOrderStatus } from '@/modules/admin/orders/hooks/useUpdateOrderStatus'
import type { OrderStatusChangeValues } from '@/modules/admin/orders/schemas/orderStatusChange.schema'
import { cn } from '@/lib/utils'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n)
}

const orderLineColumns: ColumnDef<AdminOrderLine>[] = [
  { accessorKey: 'nomeProduto', header: 'Produto', cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span> },
  { accessorKey: 'sku', header: 'SKU', meta: { className: 'hidden sm:table-cell text-muted-foreground text-sm' } },
  {
    accessorKey: 'quantidade',
    header: () => <span className="block text-right">Qtd</span>,
    cell: ({ getValue }) => <span className="block text-right tabular-nums">{Number(getValue())}</span>,
  },
  {
    accessorKey: 'precoUnitario',
    header: () => <span className="block text-right">Preço unit.</span>,
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">{formatMoney(Number(getValue()))}</span>
    ),
  },
  {
    accessorKey: 'subtotal',
    header: () => <span className="block text-right">Subtotal</span>,
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">{formatMoney(Number(getValue()))}</span>
    ),
  },
]

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-PT', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data, isLoading, isError, error, refetch } = useAdminOrderDetail(orderId)
  const { can } = usePermissions()
  const { isModuleEnabled } = useTenantPlatform()
  const canEdit = can(PERMISSIONS.ORDERS_ADMIN_EDIT_STATUS)
  const canViewFiscal = can(PERMISSIONS.FISCAL_VIEW)
  const fiscalEnabled = isModuleEnabled('fiscal') && canViewFiscal
  const [dialogOpen, setDialogOpen] = useState(false)
  const updateStatus = useUpdateOrderStatus()

  const orderIdNumeric = orderId ? Number(orderId) : NaN
  const orderIdValid = Number.isFinite(orderIdNumeric) && orderIdNumeric > 0

  const handleStatusSubmit = async (values: OrderStatusChangeValues) => {
    if (!orderId) return
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: values.status,
        nota: values.nota?.trim() || undefined,
      })
      toast.success('Estado atualizado')
      setDialogOpen(false)
      void refetch()
    } catch {
      /* toast global */
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive text-base">Pedido indisponível</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : 'Não foi possível carregar o pedido.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Link to="/admin/pedidos" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            Voltar à lista
          </Link>
          <Button type="button" size="sm" variant="secondary" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/pedidos"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
          >
            <ArrowLeft className="size-4" />
            Pedidos
          </Link>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{data.numero}</h2>
          <AdminOrderStatusBadge status={data.status} />
        </div>
        {canEdit ? (
          <Button type="button" size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
            <PencilLine className="size-4" />
            Alterar estado
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resumo</CardTitle>
          <CardDescription>Cliente e totais do pedido.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Cliente</span>
            <p className="font-medium">{data.clienteNome}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total</span>
            <p className="font-medium tabular-nums">{formatMoney(data.total)}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-muted-foreground">Criado em</span>
            <p>{formatDate(data.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="linhas">
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="linhas">Linhas</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          {fiscalEnabled ? <TabsTrigger value="fiscal">Fiscal</TabsTrigger> : null}
        </TabsList>
        <TabsContent value="linhas" className="mt-4">
          <DataTable
            columns={orderLineColumns}
            data={data.linhas}
            density="dense"
            getRowId={(l) => String(l.id)}
            emptyState={{
              title: 'Sem linhas',
              description: 'Este pedido não tem linhas detalhadas.',
            }}
          />
        </TabsContent>
        <TabsContent value="historico" className="mt-4">
          <ul className="border-border divide-y rounded-xl border">
            {data.historico.map((h) => (
              <li key={h.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <AdminOrderStatusBadge status={h.status} />
                  {h.nota ? (
                    <span className="text-muted-foreground text-sm">{h.nota}</span>
                  ) : null}
                </div>
                <div className="text-muted-foreground flex flex-col text-xs sm:text-right">
                  <span>{formatDate(h.createdAt)}</span>
                  {h.autor ? <span>por {h.autor}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        {fiscalEnabled ? (
          <TabsContent value="fiscal" className="mt-4">
            {orderIdValid ? (
              <OrderFiscalCard orderId={orderIdNumeric} orderLabel={data.numero} />
            ) : (
              <p className="text-muted-foreground text-sm">Identificador de pedido inválido.</p>
            )}
          </TabsContent>
        ) : null}
      </Tabs>

      <AdminOrderStatusDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderId={data.numero}
        currentStatus={data.status}
        isSubmitting={updateStatus.isPending}
        onSubmit={handleStatusSubmit}
      />
    </div>
  )
}
