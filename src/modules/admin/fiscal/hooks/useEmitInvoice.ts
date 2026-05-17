import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { emitInvoice } from '@/modules/admin/fiscal/services/fiscal.api'
import type { EmitInvoiceInput } from '@/modules/admin/fiscal/types'

export function useEmitInvoice() {
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: EmitInvoiceInput) => {
      if (companyId == null) throw new Error('Empresa não identificada na sessão.')
      return emitInvoice(companyId, input)
    },
    onSuccess: () => {
      toast.success('Emissão enviada para processamento.')
      void qc.invalidateQueries({ queryKey: ['admin', 'fiscal', 'invoices'] })
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Falha ao emitir nota.'
      toast.error(msg)
    },
  })
}
