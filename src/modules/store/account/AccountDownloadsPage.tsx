import { Download } from 'lucide-react'
import { EmptyState } from '@/components/layout/EmptyState'

export function AccountDownloadsPage() {
  return (
    <div className="space-y-4">
      <h2 className="section-title">Downloads</h2>
      <EmptyState
        icon={Download}
        title="Em breve"
        description="Ficheiros aprovados e provas finais aparecerão aqui quando estiverem disponíveis."
      />
    </div>
  )
}
