import { useState } from 'react'
import { Download, FileX, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/core/types/permissions'
import { usePermissions } from '@/hooks/usePermissions'
import { CancelInvoiceDialog } from '@/modules/admin/fiscal/components/CancelInvoiceDialog'
import { EmitInvoiceDialog } from '@/modules/admin/fiscal/components/EmitInvoiceDialog'
import { useCancelInvoice } from '@/modules/admin/fiscal/hooks/useCancelInvoice'
import { useDownloadInvoiceFile } from '@/modules/admin/fiscal/hooks/useDownloadInvoiceFile'
import { useEmitInvoice } from '@/modules/admin/fiscal/hooks/useEmitInvoice'
import type { FiscalInvoiceDetail } from '@/modules/admin/fiscal/types'

type InvoiceActionsBarProps = {
  invoice: FiscalInvoiceDetail
  /** Chamado após operação bem-sucedida (ex.: refetch do detalhe). */
  onAfterAction?: () => void
}

export function InvoiceActionsBar({ invoice, onAfterAction }: InvoiceActionsBarProps) {
  const { can } = usePermissions()
  const canWrite = can(PERMISSIONS.FISCAL_WRITE)
  const download = useDownloadInvoiceFile()
  const emit = useEmitInvoice()
  const cancel = useCancelInvoice()

  const [cancelOpen, setCancelOpen] = useState(false)
  const [resendOpen, setResendOpen] = useState(false)

  const canCancel = canWrite && invoice.status === 'emitida'
  const canResend = canWrite && (invoice.status === 'rejeitada' || invoice.status === 'pendente')

  const baseName = invoice.numeroNota
    ? `nfe-${invoice.numeroNota}`
    : `nfe-${invoice.id}`

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1"
        disabled={!invoice.hasXmlFile}
        title={invoice.hasXmlFile ? 'Baixar XML' : 'XML ainda não disponível.'}
        onClick={() => void download(invoice.id, 'xml', `${baseName}.xml`)}
      >
        <Download className="size-4" /> XML
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1"
        disabled={!invoice.hasPdfFile}
        title={invoice.hasPdfFile ? 'Baixar DANFE PDF' : 'DANFE PDF ainda não disponível.'}
        onClick={() => void download(invoice.id, 'pdf', `${baseName}.pdf`)}
      >
        <Download className="size-4" /> DANFE
      </Button>

      {canResend ? (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="gap-1"
          onClick={() => setResendOpen(true)}
          disabled={emit.isPending}
        >
          <RefreshCw className="size-4" /> Reenviar
        </Button>
      ) : null}

      {canCancel ? (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="gap-1"
          onClick={() => setCancelOpen(true)}
          disabled={cancel.isPending}
        >
          <FileX className="size-4" /> Cancelar nota
        </Button>
      ) : null}

      <CancelInvoiceDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        invoiceLabel={invoice.numeroNota ?? `#${invoice.id}`}
        isSubmitting={cancel.isPending}
        onSubmit={async (values) => {
          try {
            await cancel.mutateAsync({
              invoiceId: invoice.id,
              justificativa: values.justificativa.trim(),
            })
            setCancelOpen(false)
            onAfterAction?.()
          } catch {
            /* toast tratado no hook */
          }
        }}
      />

      <EmitInvoiceDialog
        open={resendOpen}
        onOpenChange={setResendOpen}
        orderLabel={`#${invoice.orderId}`}
        intent="resend"
        isSubmitting={emit.isPending}
        onConfirm={async () => {
          try {
            await emit.mutateAsync({ orderId: invoice.orderId })
            setResendOpen(false)
            onAfterAction?.()
          } catch {
            /* toast tratado no hook */
          }
        }}
      />
    </div>
  )
}
