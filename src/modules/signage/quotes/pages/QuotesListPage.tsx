import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { FileText, Plus } from 'lucide-react'
import {
  DataTable,
  DataTablePagination,
  DataTableRowActions,
  DataTableToolbar,
  rowAction,
} from '@/components/data-table'
import { buttonVariants } from '@/components/ui/button'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { listQuotes, quotesListKey } from '@/modules/signage/quotes/services/quotes.api'
import type { Quote, QuoteStatus } from '@/modules/signage/quotes/types'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { QUOTE_STATUS_LABELS } from '@/modules/signage/shared/components/status-labels'
import { formatCurrency, formatDatePt } from '@/modules/signage/shared/utils/format'
import { cn } from '@/lib/utils'

const STATUSES: QuoteStatus[] = ['rascunho', 'enviado', 'aprovado', 'recusado', 'convertido']
const PAGE_SIZE = 20

export function QuotesListPage() {
  const companyId = useCurrentCompanyId()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<QuoteStatus | ''>('')
  const [page, setPage] = useState(1)

  const params = useMemo(
    () => ({ search, status, page, pageSize: PAGE_SIZE }),
    [search, status, page],
  )

  const { data, isLoading } = useQuery({
    queryKey: quotesListKey(companyId, params),
    queryFn: () => listQuotes(companyId as number, params),
    enabled: companyId != null,
  })

  const columns = useMemo<ColumnDef<Quote>[]>(
    () => [
      { header: 'Número', accessorKey: 'number', cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span> },
      { header: 'Cliente', accessorKey: 'clientName', meta: { className: 'hidden sm:table-cell' } },
      {
        header: 'Total',
        cell: ({ row }) => <span className="tabular-nums">{formatCurrency(row.original.total)}</span>,
      },
      {
        header: 'Estado',
        cell: ({ row }) => {
          const s = QUOTE_STATUS_LABELS[row.original.status]
          return <StatusBadge label={s?.label ?? row.original.status} tone={s?.tone} />
        },
      },
      {
        header: 'Atualizado',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">{formatDatePt(row.original.updatedAt)}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DataTableRowActions
            primaryHref={`/admin/signage/orcamentos/${row.original.id}`}
            primaryLabel="Abrir"
            items={[rowAction('Abrir orçamento', { kind: 'view', href: `/admin/signage/orcamentos/${row.original.id}` })]}
          />
        ),
      },
    ],
    [],
  )

  const total = data?.total ?? 0

  return (
    <PageShell
      title="Orçamentos"
      subtitle="Histórico, aprovação e conversão em pedidos."
      actions={
        <Link to="/admin/signage/orcamentos/novo" className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="mr-1 size-4" />
          Novo orçamento
        </Link>
      }
    >
      <DataTableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        searchPlaceholder="Buscar cliente ou número…"
        resultCount={total}
        filters={
          <select
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as QuoteStatus | '')
              setPage(1)
            }}
          >
            <option value="">Todos estados</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {QUOTE_STATUS_LABELS[s]?.label ?? s}
              </option>
            ))}
          </select>
        }
      />
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        getRowId={(r) => String(r.id)}
        emptyState={{
          title: 'Nenhum orçamento',
          description: 'Crie um novo orçamento ou altere os filtros.',
          icon: FileText,
          action: { label: 'Novo orçamento', to: '/admin/signage/orcamentos/novo' },
        }}
      />
      {total > 0 ? (
        <DataTablePagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
      ) : null}
    </PageShell>
  )
}
