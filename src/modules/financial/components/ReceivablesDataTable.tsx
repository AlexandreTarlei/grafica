import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Wallet } from 'lucide-react'
import { DataTable, DataTablePagination } from '@/components/data-table'
import { StatusBadge, type StatusTone } from '@/components/status/StatusBadge'
import type { ReceivableRow, ReceivableStatus } from '@/modules/financial/types'
import { formatCurrencyEUR } from '@/modules/financial/utils/format'

const STATUS_LABEL: Record<ReceivableStatus, string> = {
  aberto: 'Aberto',
  parcial: 'Parcial',
  vencido: 'Vencido',
  liquidado: 'Liquidado',
}

const STATUS_TONE: Record<ReceivableStatus, StatusTone> = {
  aberto: 'info',
  parcial: 'warning',
  vencido: 'danger',
  liquidado: 'success',
}

type ReceivablesDataTableProps = {
  data: ReceivableRow[]
  loading?: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function ReceivablesDataTable({
  data,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: ReceivablesDataTableProps) {
  const columns = useMemo<ColumnDef<ReceivableRow>[]>(
    () => [
      { accessorKey: 'documento', header: 'Documento', cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span> },
      { accessorKey: 'cliente', header: 'Cliente', meta: { className: 'hidden sm:table-cell' } },
      {
        accessorKey: 'valor',
        header: () => <span className="block text-right">Valor</span>,
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums">{formatCurrencyEUR(Number(getValue()))}</span>
        ),
      },
      { accessorKey: 'vencimento', header: 'Vencimento', meta: { className: 'hidden md:table-cell' } },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const s = getValue() as ReceivableStatus
          return <StatusBadge label={STATUS_LABEL[s]} tone={STATUS_TONE[s]} />
        },
      },
    ],
    [],
  )

  return (
    <div className={className}>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        getRowId={(r) => r.id}
        emptyState={{
          title: 'Sem contas a receber',
          description: 'Nenhum documento corresponde aos filtros.',
          icon: Wallet,
        }}
      />
      {total > 0 && !loading ? (
        <div className="mt-3">
          <DataTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
            oneBased={false}
          />
        </div>
      ) : null}
    </div>
  )
}
