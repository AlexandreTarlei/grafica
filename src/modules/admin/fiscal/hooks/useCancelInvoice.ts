import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { cancelInvoice } from '@/modules/admin/fiscal/services/fiscal.api'
import type { CancelInvoiceInput } from '@/modules/admin/fiscal/types'

export function useCancelInvoice() {
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: CancelInvoiceInput) => {
      if (companyId == null) throw new Error('Empresa não identificada na sessão.')
      return cancelInvoice(companyId, input)
    },
    onSuccess: () => {
      toast.success('Pedido de cancelamento enviado.')
      void qc.invalidateQueries({ queryKey: ['admin', 'fiscal', 'invoices'] })
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Falha ao cancelar nota.'
      toast.error(msg)
    },
  })
}
