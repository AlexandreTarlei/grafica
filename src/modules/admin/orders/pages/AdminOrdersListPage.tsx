import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { DataTableBulkBar, DataTablePagination, downloadCsv } from '@/components/data-table'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/core/types/permissions'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminOrdersFilters } from '@/modules/admin/orders/components/AdminOrdersFilters'
import { AdminOrdersTable } from '@/modules/admin/orders/components/AdminOrdersTable'
import { useAdminOrdersList } from '@/modules/admin/orders/hooks/useAdminOrdersList'
import type { AdminOrderListParams } from '@/modules/admin/orders/types'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

const emptyFilters = (): Pick<AdminOrderListParams, 'search' | 'status' | 'dateFrom' | 'dateTo'> => ({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: '',
})

export function AdminOrdersListPage() {
  const { can } = usePermissions()
  const canEditStatus = can(PERMISSIONS.ORDERS_ADMIN_EDIT_STATUS)

  const [page, setPage] = useState(1)
  const [draft, setDraft] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const listParams: AdminOrderListParams = useMemo(
    () => ({
      ...applied,
      page,
      pageSize: PAGE_SIZE,
    }),
    [applied, page],
  )

  const { data, isLoading, isError, error, refetch } = useAdminOrdersList(listParams)

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const selectedCount = Object.keys(rowSelection).length

  const exportSelected = () => {
    const selected = items.filter((r) => rowSelection[String(r.id)])
    if (selected.length === 0) return
    downloadCsv(
      'pedidos-selecionados.csv',
      ['Número', 'Cliente', 'Total', 'Estado', 'Data'],
      selected.map((o) => [o.numero, o.clienteNome, String(o.total), o.status, o.createdAt]),
    )
    toast.success(`${selected.length} pedido(s) exportado(s)`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="page-title text-2xl">Pedidos</h2>
          <p className="text-muted-foreground text-sm">
            Gestão de pedidos da loja. {canEditStatus ? 'Pode alterar estados nos detalhes.' : null}
          </p>
        </div>
        <Link
          to="/carrinho"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'inline-flex')}
        >
          Ir à loja (carrinho)
        </Link>
      </div>

      <AdminOrdersFilters
        values={draft}
        onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
        onApply={() => {
          setApplied(draft)
          setPage(1)
          setRowSelection({})
        }}
        onReset={() => {
          const e = emptyFilters()
          setDraft(e)
          setApplied(e)
          setPage(1)
          setRowSelection({})
        }}
      />

      {isError ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive text-base">Erro ao carregar</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'Tente novamente.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Recarregar
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <DataTableBulkBar selectedCount={selectedCount} onClear={() => setRowSelection({})}>
        <Button type="button" size="sm" variant="outline" onClick={exportSelected}>
          <Download className="mr-1 size-4" />
          Exportar seleção
        </Button>
      </DataTableBulkBar>

      <AdminOrdersTable
        rows={items}
        loading={isLoading}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      {total > 0 ? (
        <DataTablePagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={(p) => {
            setPage(p)
            setRowSelection({})
          }}
        />
      ) : null}
    </div>
  )
}
