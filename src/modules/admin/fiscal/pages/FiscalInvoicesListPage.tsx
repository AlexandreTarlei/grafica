import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InvoicesFilters } from '@/modules/admin/fiscal/components/InvoicesFilters'
import { InvoicesTable } from '@/modules/admin/fiscal/components/InvoicesTable'
import { useFiscalInvoicesList } from '@/modules/admin/fiscal/hooks/useFiscalInvoicesList'
import type { FiscalInvoiceListParams } from '@/modules/admin/fiscal/types'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

const emptyFilters = (): Pick<FiscalInvoiceListParams, 'search' | 'status' | 'dateFrom' | 'dateTo'> => ({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: '',
})

export function FiscalInvoicesListPage() {
  const [page, setPage] = useState(1)
  const [draft, setDraft] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)

  const listParams: FiscalInvoiceListParams = useMemo(
    () => ({
      ...applied,
      page,
      pageSize: PAGE_SIZE,
    }),
    [applied, page],
  )

  const { data, isLoading, isError, error, refetch } = useFiscalInvoicesList(listParams)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Notas fiscais</h2>
          <p className="text-muted-foreground text-sm">
            Listagem de NF-e emitidas pelo módulo fiscal — busca, filtros e paginação.
          </p>
        </div>
        <Link
          to="/admin/fiscal/painel"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Voltar ao painel
        </Link>
      </div>

      <InvoicesFilters
        values={draft}
        onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
        onApply={() => {
          setApplied(draft)
          setPage(1)
        }}
        onReset={() => {
          const e = emptyFilters()
          setDraft(e)
          setApplied(e)
          setPage(1)
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

      <InvoicesTable
        rows={data?.items ?? []}
        loading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />
    </div>
  )
}
