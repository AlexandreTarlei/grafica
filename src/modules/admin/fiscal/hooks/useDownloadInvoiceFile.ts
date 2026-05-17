import { useCallback } from 'react'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { downloadInvoicePdf, downloadInvoiceXml } from '@/modules/admin/fiscal/services/fiscal.api'

export type DownloadKind = 'xml' | 'pdf'

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

/**
 * Faz download do ficheiro fiscal (XML ou DANFE PDF) duma nota.
 * Cria um anchor temporário, dispara o download e revoga a object URL.
 */
export function useDownloadInvoiceFile() {
  const companyId = useCurrentCompanyId()

  return useCallback(
    async (invoiceId: number, kind: DownloadKind, suggestedName?: string): Promise<void> => {
      if (companyId == null) {
        toast.error('Empresa não identificada na sessão.')
        return
      }
      try {
        const blob =
          kind === 'xml'
            ? await downloadInvoiceXml(companyId, invoiceId)
            : await downloadInvoicePdf(companyId, invoiceId)
        const ext = kind === 'xml' ? 'xml' : 'pdf'
        const name = suggestedName?.trim() || `nfe-${invoiceId}.${ext}`
        triggerBrowserDownload(blob, name)
      } catch (err) {
        const msg = err instanceof Error ? err.message : `Falha ao baixar ${kind.toUpperCase()}.`
        toast.error(msg)
      }
    },
    [companyId],
  )
}
