import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { DataTable, DataTableRowActions, rowAction } from '@/components/data-table'
import { StatusBadge, type StatusTone } from '@/components/status/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecentTableRow } from '@/modules/dashboard/types'

type RecentDataTableProps = {
  title: string
  description?: string
  rows: RecentTableRow[]
  loading?: boolean
  emptyTitle?: string
  viewAllHref?: string
}

export function RecentDataTable({
  title,
  description,
  rows,
  loading,
  emptyTitle = 'Sem registos recentes',
  viewAllHref,
}: RecentDataTableProps) {
  const columns = useMemo<ColumnDef<RecentTableRow>[]>(
    () => [
      {
        header: 'Referência',
        accessorKey: 'primary',
        cell: ({ row }) =>
          row.original.href ? (
            <Link to={row.original.href} className="hover:text-primary font-medium transition-colors">
              {row.original.primary}
            </Link>
          ) : (
            <span className="font-medium">{row.original.primary}</span>
          ),
      },
      {
        header: 'Detalhe',
        accessorKey: 'secondary',
        meta: { className: 'hidden sm:table-cell max-w-[12rem]' },
        cell: ({ getValue }) => (
          <span className="text-muted-foreground truncate">{String(getValue() ?? '—')}</span>
        ),
      },
      {
        header: 'Estado',
        cell: ({ row }) =>
          row.original.status ? (
            <StatusBadge
              label={row.original.status}
              tone={(row.original.statusTone ?? 'default') as StatusTone}
            />
          ) : (
            '—'
          ),
      },
      {
        header: 'Valor',
        accessorKey: 'meta',
        cell: ({ getValue }) => <span className="text-right tabular-nums">{String(getValue() ?? '—')}</span>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) =>
          row.original.href ? (
            <DataTableRowActions
              items={[rowAction('Abrir', { kind: 'view', href: row.original.href })]}
            />
          ) : null,
      },
    ],
    [],
  )

  return (
    <Card className="shadow-card overflow-hidden ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description ? <CardDescription className="mt-0.5">{description}</CardDescription> : null}
        </div>
        {viewAllHref ? (
          <Button variant="ghost" size="sm" render={<Link to={viewAllHref} />} nativeButton={false}>
            Ver todos
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        <DataTable
          columns={columns}
          data={rows}
          loading={loading}
          density="dense"
          getRowId={(r) => r.id}
          className="rounded-lg border-0 shadow-none ring-0"
          emptyState={{ title: emptyTitle }}
        />
      </CardContent>
    </Card>
  )
}
