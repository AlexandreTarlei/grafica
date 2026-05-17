import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InvoiceStatusBadge } from '@/modules/admin/fiscal/components/InvoiceStatusBadge'
import type { FiscalInvoiceDetail } from '@/modules/admin/fiscal/types'

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

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm font-medium'}>{value}</span>
    </div>
  )
}

export function InvoiceSummaryCard({ invoice }: { invoice: FiscalInvoiceDetail }) {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-2">
        <div>
          <CardTitle className="text-base">Resumo da nota</CardTitle>
          <CardDescription>Identificação fiscal e protocolo de autorização.</CardDescription>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Row label="Número" value={invoice.numeroNota ?? '—'} />
        <Row label="Série" value={invoice.serie ?? '—'} />
        <Row label="Ambiente" value={invoice.ambiente} />
        <Row label="Cliente" value={invoice.clienteNome ?? '—'} />
        <Row
          label="Pedido"
          value={
            <a href={`/admin/pedidos/${invoice.orderId}`} className="hover:underline tabular-nums">
              #{invoice.orderId}
            </a>
          }
        />
        <Row
          label="Valor total"
          value={typeof invoice.valorTotal === 'number' ? formatMoney(invoice.valorTotal) : '—'}
        />
        <Row label="Chave NF-e" value={invoice.chaveNfe ?? '—'} mono />
        <Row label="Protocolo" value={invoice.protocolo ?? '—'} mono />
        <Row label="Provider" value={`${invoice.provider}${invoice.providerRef ? ` · ${invoice.providerRef}` : ''}`} />
        <Row label="Criada em" value={formatDate(invoice.createdAt)} />
        <Row label="Atualizada em" value={formatDate(invoice.updatedAt)} />
        {invoice.lastError ? (
          <div className="border-destructive/40 bg-destructive/5 text-destructive sm:col-span-2 lg:col-span-3 rounded-md border p-3 text-sm">
            <span className="font-medium">Erro fiscal:</span> {invoice.lastError}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
