import { CircleAlert, CircleCheck, CircleDashed, CircleOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { FiscalDashboardKpis } from '@/modules/admin/fiscal/types'
import { cn } from '@/lib/utils'

type SefazStatus = FiscalDashboardKpis['sefazHealth']

const LABELS: Record<SefazStatus, string> = {
  operational: 'SEFAZ operacional',
  degraded: 'SEFAZ degradado',
  homologation: 'Ambiente homologação',
  offline: 'SEFAZ não configurado',
  unknown: 'SEFAZ desconhecido',
}

const VARIANT: Record<SefazStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  operational: 'default',
  degraded: 'destructive',
  homologation: 'secondary',
  offline: 'outline',
  unknown: 'outline',
}

const ICON = {
  operational: CircleCheck,
  degraded: CircleAlert,
  homologation: CircleDashed,
  offline: CircleOff,
  unknown: CircleDashed,
} as const

export function SefazStatusBadge({
  status,
  className,
}: {
  status: SefazStatus
  className?: string
}) {
  const Icon = ICON[status]
  return (
    <Badge variant={VARIANT[status]} className={cn('gap-1 font-normal', className)}>
      <Icon className="size-3" />
      {LABELS[status]}
    </Badge>
  )
}
