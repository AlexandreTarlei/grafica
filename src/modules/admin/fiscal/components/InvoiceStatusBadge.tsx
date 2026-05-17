import { StatusBadge, type StatusTone } from '@/components/status/StatusBadge'
import type { FiscalInvoiceStatus } from '@/modules/admin/fiscal/types'
import { cn } from '@/lib/utils'

const LABELS: Record<FiscalInvoiceStatus, string> = {
  pendente: 'Pendente',
  processando: 'A processar',
  emitida: 'Emitida',
  rejeitada: 'Rejeitada',
  cancelada: 'Cancelada',
  inutilizada: 'Inutilizada',
}

const TONE: Record<FiscalInvoiceStatus, StatusTone> = {
  pendente: 'warning',
  processando: 'info',
  emitida: 'success',
  rejeitada: 'danger',
  cancelada: 'muted',
  inutilizada: 'muted',
}

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: FiscalInvoiceStatus
  className?: string
}) {
  return <StatusBadge label={LABELS[status]} tone={TONE[status]} className={cn(className)} />
}
