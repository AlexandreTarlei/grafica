import { CheckCircle, CircleAlert, CircleDot, FileMinus, FilePlus, Loader2 } from 'lucide-react'
import type { FiscalEvent, FiscalInvoiceDetail } from '@/modules/admin/fiscal/types'
import { cn } from '@/lib/utils'

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

const ICON = {
  created: FilePlus,
  authorized: CheckCircle,
  rejected: CircleAlert,
  cancelled: FileMinus,
  updated: CircleDot,
} as const

const TONE = {
  created: 'text-muted-foreground',
  authorized: 'text-emerald-600 dark:text-emerald-400',
  rejected: 'text-destructive',
  cancelled: 'text-muted-foreground',
  updated: 'text-muted-foreground',
} as const

/**
 * Deriva uma lista de eventos a partir dos campos da nota. Enquanto o backend
 * não expõe um endpoint de timeline, esta é a melhor aproximação.
 */
function buildInvoiceTimeline(invoice: FiscalInvoiceDetail): FiscalEvent[] {
  const events: FiscalEvent[] = [
    {
      id: 'created',
      kind: 'created',
      label: 'Nota criada',
      description: `Provider: ${invoice.provider}`,
      at: invoice.createdAt,
    },
  ]

  if (invoice.status === 'processando') {
    events.push({
      id: 'processing',
      kind: 'updated',
      label: 'Processando emissão',
      description: 'Aguardando retorno do provider / SEFAZ.',
      at: invoice.updatedAt,
    })
  }

  if (invoice.protocolo) {
    events.push({
      id: 'authorized',
      kind: 'authorized',
      label: 'Autorizada pela SEFAZ',
      description: `Protocolo: ${invoice.protocolo}`,
      at: invoice.updatedAt,
    })
  }

  if (invoice.lastError) {
    events.push({
      id: 'rejected',
      kind: 'rejected',
      label: 'Rejeitada',
      description: invoice.lastError,
      at: invoice.updatedAt,
    })
  }

  if (invoice.status === 'cancelada') {
    events.push({
      id: 'cancelled',
      kind: 'cancelled',
      label: 'Cancelada',
      description: 'Cancelamento confirmado.',
      at: invoice.updatedAt,
    })
  }

  return events.sort((a, b) => (a.at < b.at ? -1 : 1))
}

export function InvoiceTimeline({ invoice }: { invoice: FiscalInvoiceDetail }) {
  const events = buildInvoiceTimeline(invoice)

  if (!events.length) {
    return (
      <p className="text-muted-foreground border-muted-foreground/30 rounded-xl border border-dashed p-10 text-center text-sm">
        Sem eventos para esta nota.
      </p>
    )
  }

  return (
    <ol className="border-border space-y-0 divide-y rounded-xl border">
      {events.map((ev) => {
        const Icon = ev.kind === 'updated' && invoice.status === 'processando' ? Loader2 : ICON[ev.kind]
        const animate = ev.kind === 'updated' && invoice.status === 'processando'
        return (
          <li key={ev.id} className="flex items-start gap-3 px-4 py-3">
            <Icon
              className={cn('mt-0.5 size-4 shrink-0', TONE[ev.kind], animate && 'animate-spin')}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">{ev.label}</span>
                <span className="text-muted-foreground text-xs">{formatDate(ev.at)}</span>
              </div>
              {ev.description ? (
                <p className="text-muted-foreground mt-0.5 text-sm">{ev.description}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
