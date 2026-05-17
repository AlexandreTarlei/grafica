import { FileText } from 'lucide-react'
import { EmptyState } from '@/components/layout/EmptyState'

export function AccountInvoicesPage() {
  return (
    <div className="space-y-4">
      <h2 className="section-title">Faturas</h2>
      <EmptyState
        icon={FileText}
        title="Em breve"
        description="O histórico de faturação e documentos fiscais estará disponível aqui."
      />
    </div>
  )
}
