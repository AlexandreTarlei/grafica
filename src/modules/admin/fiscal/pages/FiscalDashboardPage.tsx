import { Link } from 'react-router-dom'
import { ArrowRight, FileText, ScrollText } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FiscalKpiStrip } from '@/modules/admin/fiscal/components/FiscalKpiStrip'
import { InvoiceStatusBadge } from '@/modules/admin/fiscal/components/InvoiceStatusBadge'
import { useFiscalDashboardKpis } from '@/modules/admin/fiscal/hooks/useFiscalDashboardKpis'
import { useFiscalInvoicesList } from '@/modules/admin/fiscal/hooks/useFiscalInvoicesList'
import { useFiscalSettings } from '@/modules/admin/fiscal/hooks/useFiscalSettings'
import type { FiscalInvoiceListItem, FiscalInvoiceStatus } from '@/modules/admin/fiscal/types'
import { cn } from '@/lib/utils'

function MiniList({
  title,
  description,
  rows,
  loading,
  emptyLabel,
}: {
  title: string
  description: string
  rows: FiscalInvoiceListItem[]
  loading: boolean
  emptyLabel: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{emptyLabel}</p>
        ) : (
          <ul className="divide-y">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <Link
                    to={`/admin/fiscal/notas/${row.id}`}
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {row.numeroNota ? `Nº ${row.numeroNota}` : `Nota #${row.id}`} ·{' '}
                    <span className="text-muted-foreground font-normal">
                      {row.clienteNome ?? `Pedido #${row.orderId}`}
                    </span>
                  </Link>
                </div>
                <InvoiceStatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

const PARAMS_REJEITADAS = {
  page: 1,
  pageSize: 10,
  search: '',
  status: 'rejeitada' as FiscalInvoiceStatus,
  dateFrom: '',
  dateTo: '',
}

const PARAMS_PENDENTES = {
  page: 1,
  pageSize: 10,
  search: '',
  status: 'pendente' as FiscalInvoiceStatus,
  dateFrom: '',
  dateTo: '',
}

export function FiscalDashboardPage() {
  const kpis = useFiscalDashboardKpis()
  const settings = useFiscalSettings()
  const rejeitadas = useFiscalInvoicesList(PARAMS_REJEITADAS)
  const pendentes = useFiscalInvoicesList(PARAMS_PENDENTES)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Painel fiscal</h2>
          <p className="text-muted-foreground text-sm">
            Acompanhe emissões, rejeições e estado do ambiente SEFAZ.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/fiscal/notas"
            className={cn(buttonVariants({ size: 'sm' }), 'gap-1')}
          >
            <FileText className="size-4" />
            Ver todas as notas
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {kpis.isError ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive text-base">Erro ao carregar indicadores</CardTitle>
            <CardDescription>
              {kpis.error instanceof Error ? kpis.error.message : 'Tente novamente.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" size="sm" onClick={() => void kpis.refetch()}>
              Recarregar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <FiscalKpiStrip kpis={kpis.data} loading={kpis.isLoading} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <MiniList
          title="Pendentes"
          description="Aguardando emissão ou processamento pelo provider."
          rows={pendentes.data?.items ?? []}
          loading={pendentes.isLoading}
          emptyLabel="Sem notas pendentes."
        />
        <MiniList
          title="Rejeitadas"
          description="Falharam na SEFAZ — verifique o motivo e reenvie."
          rows={rejeitadas.data?.items ?? []}
          loading={rejeitadas.isLoading}
          emptyLabel="Sem rejeições recentes."
        />
      </div>

      {settings.data ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              <ScrollText className="mr-2 inline size-4 align-middle" />
              Configurações fiscais
            </CardTitle>
            <CardDescription>Resumo das credenciais e ambiente atuais.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">Ambiente</span>
              <p className="font-medium capitalize">{settings.data.environment}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">Emitente</span>
              <p className="truncate font-medium">
                {settings.data.nomeFantasiaEmitente ?? settings.data.nomeEmitente}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">CNPJ</span>
              <p className="font-mono text-xs">{settings.data.cnpjEmitente}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">Série NF-e</span>
              <p className="font-medium">{settings.data.serieNfe}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
