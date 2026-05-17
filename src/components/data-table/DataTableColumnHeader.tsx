import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

type DataTableColumnHeaderProps<T> = {
  column: Column<T, unknown>
  title: string
  align?: 'left' | 'right'
  className?: string
}

export function DataTableColumnHeader<T>({
  column,
  title,
  align = 'left',
  className,
}: DataTableColumnHeaderProps<T>) {
  const sorted = column.getIsSorted()
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown

  if (!column.getCanSort()) {
    return <span className={cn('text-xs font-medium uppercase tracking-wide', className)}>{title}</span>
  }

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className={cn(
        'hover:text-foreground inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors',
        align === 'right' && 'ml-auto justify-end',
        className,
      )}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
    >
      {title}
      <Icon className="size-3.5 opacity-70" />
    </button>
  )
}
