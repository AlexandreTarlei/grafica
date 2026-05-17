import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableFilterBarProps = {
  children?: ReactNode
  onApply?: () => void
  onReset?: () => void
  applyLabel?: string
  resetLabel?: string
  className?: string
}

export function DataTableFilterBar({
  children,
  onApply,
  onReset,
  applyLabel = 'Aplicar',
  resetLabel = 'Limpar',
  className,
}: DataTableFilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-end gap-2', className)}>
      {children}
      {onApply ? (
        <Button type="button" size="sm" onClick={onApply}>
          {applyLabel}
        </Button>
      ) : null}
      {onReset ? (
        <Button type="button" size="sm" variant="outline" onClick={onReset}>
          {resetLabel}
        </Button>
      ) : null}
    </div>
  )
}
