import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type DataTableDensity = 'default' | 'dense'

/** Em viewport &lt; md, mostra cards em vez de scroll horizontal. */
export type DataTableLayout = 'table' | 'responsive'

export type DataTableEmptyState = {
  title: string
  description?: string
  icon?: LucideIcon
  action?: { label: string; onClick?: () => void; href?: string; to?: string }
}

export type DataTablePaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  /** 1-based page index (default). Set false for 0-based (recebíveis). */
  oneBased?: boolean
}

export type { RowSelectionState, SortingState }

export type RowActionItem = {
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  destructive?: boolean
  hidden?: boolean
  /** Exige confirmação antes de `onClick` (ações destrutivas). */
  confirm?: { title: string; description?: string; confirmLabel?: string }
}
