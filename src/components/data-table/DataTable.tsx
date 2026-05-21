import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'
import { EmptyState } from '@/components/layout/EmptyState'
import { LoadingTable } from '@/components/data-table/LoadingTable'
import { DataTableMobileCards } from '@/components/data-table/DataTableMobileCards'
import type { DataTableDensity, DataTableEmptyState, DataTableLayout } from '@/components/data-table/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export type DataTableProps<T> = {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  loading?: boolean
  emptyState?: DataTableEmptyState
  className?: string
  density?: DataTableDensity
  /** `responsive`: cards em mobile, tabela a partir de `md`. */
  layout?: DataTableLayout
  /** Client-side sorting */
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  manualSorting?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  getRowId?: (row: T) => string
  columnCount?: number
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyState,
  className,
  density = 'default',
  layout = 'responsive',
  sorting,
  onSortingChange,
  manualSorting,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  columnCount,
}: DataTableProps<T>) {
  const cellClass = density === 'dense' ? 'px-3 py-2' : 'px-4 py-3'
  const headClass = density === 'dense' ? 'px-3 h-9' : 'px-4 h-10'

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    manualSorting,
    enableRowSelection: !!onRowSelectionChange,
    getRowId,
  })

  const colSpan = columnCount ?? columns.length

  if (loading) {
    return <LoadingTable columns={colSpan} dense={density === 'dense'} className={className} />
  }

  if (!data.length) {
    return (
      <EmptyState
        title={emptyState?.title ?? 'Sem resultados'}
        description={emptyState?.description}
        action={emptyState?.action}
        icon={emptyState?.icon}
        className={cn('shadow-card ring-1 ring-border/60', className)}
      />
    )
  }

  const tableWrapClass = cn('surface-card overflow-hidden', className)

  if (layout === 'responsive') {
    return (
      <div className={tableWrapClass}>
        <DataTableMobileCards table={table} />
        <div className="hidden md:block">
          <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    headClass,
                    'text-muted-foreground text-xs font-medium uppercase tracking-wide',
                    (header.column.columnDef.meta as { className?: string } | undefined)?.className,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    cellClass,
                    (cell.column.columnDef.meta as { className?: string } | undefined)?.className,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className={tableWrapClass}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    headClass,
                    'text-muted-foreground text-xs font-medium uppercase tracking-wide',
                    (header.column.columnDef.meta as { className?: string } | undefined)?.className,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    cellClass,
                    (cell.column.columnDef.meta as { className?: string } | undefined)?.className,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
