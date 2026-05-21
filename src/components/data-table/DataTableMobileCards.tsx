import { flexRender, type Column, type Table as TanStackTable } from '@tanstack/react-table'

const SKIP_COLUMN_IDS = new Set(['select', 'actions'])

type ColumnMeta = { mobileLabel?: string; className?: string }

function getHeaderLabel<T>(column: Column<T, unknown>): string {
  const meta = column.columnDef.meta as ColumnMeta | undefined
  if (meta?.mobileLabel) return meta.mobileLabel
  const h = column.columnDef.header
  if (typeof h === 'string') return h
  return column.id
}

type DataTableMobileCardsProps<T> = {
  table: TanStackTable<T>
}

export function DataTableMobileCards<T>({ table }: DataTableMobileCardsProps<T>) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {table.getRowModel().rows.map((row) => {
        const cells = row.getVisibleCells().filter((c) => !SKIP_COLUMN_IDS.has(c.column.id))
        const actionCell = row.getVisibleCells().find((c) => c.column.id === 'actions')
        const primary = cells[0]

        return (
          <li key={row.id} className="surface-card space-y-3 p-4">
            {primary ? (
              <div className="text-sm font-semibold leading-snug">
                {flexRender(primary.column.columnDef.cell, primary.getContext())}
              </div>
            ) : null}
            {cells.slice(1).map((cell) => (
              <div key={cell.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted-foreground shrink-0">{getHeaderLabel(cell.column)}</span>
                <span className="min-w-0 text-right font-medium">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
              </div>
            ))}
            {actionCell ? (
              <div className="border-border flex justify-end border-t pt-2">
                {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
