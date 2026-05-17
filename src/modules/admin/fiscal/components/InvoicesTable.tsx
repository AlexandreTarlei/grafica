import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { FileText } from 'lucide-react'
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableRowActions,
  rowAction,
} from '@/components/data-table'
import { InvoiceStatusBadge } from '@/modules/admin/fiscal/components/InvoiceStatusBadge'
import type { FiscalInvoiceListItem } from '@/modules/admin/fiscal/types'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function truncate(s: string | null | undefined, len = 14): string {
  if (!s) return '—'
  if (s.length <= len) return s
  return `${s.slice(0, len)}…`
}

type InvoicesTableProps = {
  rows: FiscalInvoiceListItem[]
  loading?: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function InvoicesTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: InvoicesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }])

  const columns = useMemo<ColumnDef<FiscalInvoiceListItem>[]>(
    () => [
      {
        accessorKey: 'numeroNota',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Número" />,
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums">{(getValue() as string | null) ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'clienteNome',
        header: 'Cliente',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ getValue }) => (getValue() as string | null) ?? <span className="text-muted-foreground">—</span>,
      },
      {
        accessorKey: 'orderId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Pedido" />,
        meta: { className: 'hidden md:table-cell' },
        cell: ({ getValue }) => {
          const id = String(getValue() as number)
          return (
            <Link to={`/admin/pedidos/${id}`} className="hover:text-primary tabular-nums transition-colors">
              #{id}
            </Link>
          )
        },
      },
      {
        accessorKey: 'valorTotal',
        header: ({ column }) => (
          <div className="text-right">
            <DataTableColumnHeader column={column} title="Valor" align="right" />
          </div>
        ),
        cell: ({ getValue }) => {
          const v = getValue() as number | null | undefined
          return (
            <div className="text-right tabular-nums">{typeof v === 'number' ? formatMoney(v) : '—'}</div>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-sm">{formatDate(getValue() as string)}</span>
        ),
      },
      {
        accessorKey: 'chaveNfe',
        header: 'Chave NF-e',
        meta: { className: 'hidden xl:table-cell' },
        cell: ({ getValue }) => {
          const chave = getValue() as string | null
          return (
            <span className="text-muted-foreground font-mono text-xs" title={chave ?? undefined}>
              {truncate(chave, 14)}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DataTableRowActions
            primaryHref={`/admin/fiscal/notas/${row.original.id}`}
            items={[
              rowAction('Ver nota', {
                kind: 'view',
                href: `/admin/fiscal/notas/${row.original.id}`,
              }),
            ]}
          />
        ),
      },
    ],
    [],
  )

  return (
    <div className={className}>
      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        getRowId={(r) => String(r.id)}
        emptyState={{
          title: 'Nenhuma nota fiscal',
          description: 'Nenhuma nota encontrada com os filtros atuais.',
          icon: FileText,
        }}
      />
      {total > 0 && !loading ? (
        <div className="mt-3">
          <DataTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  )
}
