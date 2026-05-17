import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, FilePlus, RefreshCw } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSIONS } from '@/core/types/permissions'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { usePermissions } from '@/hooks/usePermissions'
import { EmitInvoiceDialog } from '@/modules/admin/fiscal/components/EmitInvoiceDialog'
import { InvoiceStatusBadge } from '@/modules/admin/fiscal/components/InvoiceStatusBadge'
import { useEmitInvoice } from '@/modules/admin/fiscal/hooks/useEmitInvoice'
import { useFiscalInvoicesList } from '@/modules/admin/fiscal/hooks/useFiscalInvoicesList'
import { cn } from '@/lib/utils'

type OrderFiscalCardProps = {
  orderId: number
  orderLabel?: string
}

/**
 * Cartão fiscal para a página de detalhe do pedido. Encontra a nota associada
 * (mais recente) através do filtro `orderId` na listagem fiscal e expõe acções
 * rápidas (visualizar, emitir manualmente, reenviar).
 */
export function OrderFiscalCard({ orderId, orderLabel }: OrderFiscalCardProps) {
  const { isModuleEnabled } = useTenantPlatform()
  const { can } = usePermissions()
  const canView = can(PERMISSIONS.FISCAL_VIEW)
  const canWrite = can(PERMISSIONS.FISCAL_WRITE)
  const emit = useEmitInvoice()
  const [emitOpen, setEmitOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useFiscalInvoicesList({
    page: 1,
    pageSize: 1,
    search: '',
    status: '',
    orderId,
    dateFrom: '',
    dateTo: '',
  })

  if (!isModuleEnabled('fiscal') || !canView) return null

  const invoice = data?.items[0] ?? null
  const intent = invoice && invoice.status === 'rejeitada' ? 'resend' : 'emit'
  const resolvedLabel = orderLabel ?? `#${orderId}`

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base">Nota fiscal</CardTitle>
          <CardDescription>
            Estado fiscal do pedido {resolvedLabel}.
          </CardDescription>
        </div>
        {invoice ? <InvoiceStatusBadge status={invoice.status} /> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : isError ? (
          <div className="text-destructive flex items-center justify-between gap-2 text-sm">
            <span>Falha ao carregar estado fiscal.</span>
            <Button type="button" size="sm" variant="outline" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : invoice ? (
          <>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">Número</span>
                <p className="font-medium">{invoice.numeroNota ?? '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">Série</span>
                <p>{invoice.serie ?? '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Chave NF-e
                </span>
                <p className="font-mono text-xs break-all">{invoice.chaveNfe ?? '—'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                to={`/admin/fiscal/notas/${invoice.id}`}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'inline-flex items-center gap-1',
                )}
              >
                <ExternalLink className="size-4" />
                Ver nota
              </Link>
              {canWrite && (invoice.status === 'rejeitada' || invoice.status === 'pendente') ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="gap-1"
                  onClick={() => setEmitOpen(true)}
                  disabled={emit.isPending}
                >
                  <RefreshCw className="size-4" />
                  Reenviar
                </Button>
              ) : null}
            </div>
          </>
        ) : (
          <div className="border-muted-foreground/30 flex flex-col items-start gap-3 rounded-md border border-dashed p-4">
            <p className="text-muted-foreground text-sm">
              Nenhuma nota fiscal emitida para este pedido.
            </p>
            {canWrite ? (
              <Button
                type="button"
                size="sm"
                className="gap-1"
                onClick={() => setEmitOpen(true)}
                disabled={emit.isPending}
              >
                <FilePlus className="size-4" />
                Emitir manualmente
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>

      <EmitInvoiceDialog
        open={emitOpen}
        onOpenChange={setEmitOpen}
        orderLabel={resolvedLabel}
        intent={intent}
        isSubmitting={emit.isPending}
        onConfirm={async () => {
          try {
            await emit.mutateAsync({ orderId })
            setEmitOpen(false)
            void refetch()
          } catch {
            /* toast tratado no hook */
          }
        }}
      />
    </Card>
  )
}
