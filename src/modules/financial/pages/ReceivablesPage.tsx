import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableToolbar } from '@/components/data-table'
import { ReceivablesDataTable } from '@/modules/financial/components/ReceivablesDataTable'
import { useFinancialPeriod } from '@/modules/financial/hooks/useFinancialPeriod'
import { useReceivables } from '@/modules/financial/hooks/useReceivables'
import type { ReceivableStatus } from '@/modules/financial/types'
import { FinancialErrorState } from '@/modules/financial/widgets/FinancialErrorState'
import { FinancialPageShell } from '@/modules/financial/widgets/FinancialPageShell'

const PAGE_SIZE = 10

export function ReceivablesPage() {
  const { period, setPeriod, periodInvalid } = useFinancialPeriod()
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<ReceivableStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const q = useReceivables({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    status: status === 'all' ? '' : status,
    search: search.trim() || undefined,
  })

  return (
    <FinancialPageShell
      title="Contas a receber"
      subtitle="Documentos em aberto e estados de cobrança."
      period={period}
      onPeriodChange={setPeriod}
      periodInvalid={periodInvalid}
    >
      {q.isError ? (
        <FinancialErrorState error={q.error} onRetry={() => void q.refetch()} />
      ) : (
        <>
          <DataTableToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v)
              setPage(0)
            }}
            searchPlaceholder="Cliente ou documento…"
            resultCount={q.data?.total}
            filters={
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as ReceivableStatus | 'all')
                  setPage(0)
                }}
              >
                <SelectTrigger className="w-[10rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="liquidado">Liquidado</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <ReceivablesDataTable
            data={q.data?.items ?? []}
            loading={q.isLoading}
            page={page}
            pageSize={PAGE_SIZE}
            total={q.data?.total ?? 0}
            onPageChange={setPage}
          />
        </>
      )}
    </FinancialPageShell>
  )
}
