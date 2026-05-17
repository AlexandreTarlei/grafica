import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableBulkBarProps = {
  selectedCount: number
  onClear: () => void
  children?: ReactNode
  className?: string
}

export function DataTableBulkBar({ selectedCount, onClear, children, className }: DataTableBulkBarProps) {
  if (selectedCount <= 0) return null

  return (
    <div
      className={cn(
        'bg-primary/5 border-primary/20 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-2.5',
        className,
      )}
    >
      <span className="text-sm font-medium">
        {selectedCount} selecionado{selectedCount === 1 ? '' : 's'}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <Button type="button" size="sm" variant="ghost" onClick={onClear}>
          <X className="size-4" />
          Limpar
        </Button>
      </div>
    </div>
  )
}
