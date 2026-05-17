import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusTone = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

const TONE_CLASS: Record<StatusTone, string> = {
  default: '',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400',
  danger: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-400',
  muted: 'text-muted-foreground',
}

type StatusBadgeProps = {
  label: string
  tone?: StatusTone
  className?: string
}

export function StatusBadge({ label, tone = 'default', className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium capitalize', TONE_CLASS[tone], className)}>
      {label}
    </Badge>
  )
}
