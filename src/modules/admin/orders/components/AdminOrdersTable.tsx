import { useMemo } from 'react'
import type { ColumnDef, OnChangeFn, RowSelectionState, SortingState } from '@tanstack/react-table'
import { ShoppingBag } from 'lucide-react'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  createSelectionColumn,
  rowAction,
} from '@/components/data-table'
import { AdminOrderStatusBadge } from '@/modules/admin/orders/components/AdminOrderStatusBadge'
import type { AdminOrderListItem } from '@/modules/admin/orders/types'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n)
}

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

type AdminOrdersTableProps = {
  rows: AdminOrderListItem[]
  loading?: boolean
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

export function AdminOrdersTable({
  rows,
  loading,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
}: AdminOrdersTableProps) {
  const columns = useMemo<ColumnDef<AdminOrderListItem>[]>(
    () => [
      ...(onRowSelectionChange ? [createSelectionColumn<AdminOrderListItem>()] : []),
      {
        accessorKey: 'numero',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Número" />,
        cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span>,
      },
      {
        accessorKey: 'clienteNome',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
        meta: { className: 'hidden sm:table-cell' },
      },
      {
        accessorKey: 'total',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Total" align="right" className="w-full" />
        ),
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums">{formatMoney(Number(getValue()))}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Estado',
        enableSorting: false,
        cell: ({ row }) => <AdminOrderStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
        meta: { className: 'hidden md:table-cell' },
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-sm">{formatDate(String(getValue()))}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <DataTableRowActions
            primaryHref={`/admin/pedidos/${row.original.id}`}
            items={[rowAction('Ver pedido', { kind: 'view', href: `/admin/pedidos/${row.original.id}` })]}
          />
        ),
      },
    ],
    [onRowSelectionChange],
  )

  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={loading}
      getRowId={(r) => String(r.id)}
      sorting={sorting}
      onSortingChange={onSortingChange}
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
      emptyState={{
        title: 'Nenhum pedido encontrado',
        description: 'Ajuste os filtros ou aguarde novos pedidos.',
        icon: ShoppingBag,
      }}
    />
  )
}
