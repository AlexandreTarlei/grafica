import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDatePt } from '@/modules/signage/shared/utils/format'

export type TimelineEntry = {
  id: string
  title: string
  description?: string
  at: string
  icon?: LucideIcon
}

type TimelineProps = {
  entries: TimelineEntry[]
  className?: string
}

export function Timeline({ entries, className }: TimelineProps) {
  if (!entries.length) {
    return <p className="text-muted-foreground text-sm">Sem registos.</p>
  }

  return (
    <ol className={cn('relative space-y-4 border-s border-border ps-4', className)}>
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="bg-background border-border absolute -start-[21px] top-1 size-2.5 rounded-full border" />
          <p className="text-sm font-medium">{entry.title}</p>
          {entry.description ? (
            <p className="text-muted-foreground mt-0.5 text-xs">{entry.description}</p>
          ) : null}
          <p className="text-muted-foreground mt-1 text-xs">{formatDatePt(entry.at)}</p>
        </li>
      ))}
    </ol>
  )
}
