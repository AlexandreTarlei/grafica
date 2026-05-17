import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type DataTableToolbarProps = {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
  resultCount?: number
  className?: string
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar…',
  filters,
  actions,
  resultCount,
  className,
}: DataTableToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {onSearchChange != null ? (
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                placeholder={searchPlaceholder}
                value={search ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          ) : null}
          {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {resultCount != null ? (
        <p className="text-muted-foreground text-xs tabular-nums">{resultCount} resultado(s)</p>
      ) : null}
    </div>
  )
}
