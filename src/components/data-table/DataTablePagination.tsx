import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DataTablePaginationProps } from '@/components/data-table/types'
const DEFAULT_PAGE_SIZES = [10, 20, 50]

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  oneBased = true,
}: DataTablePaginationProps) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize))
  const displayPage = oneBased ? page : page + 1
  const displayLast = oneBased ? lastPage : lastPage - 1
  const canPrev = oneBased ? page > 1 : page > 0
  const canNext = oneBased ? page < lastPage : page < lastPage - 1

  const from = total === 0 ? 0 : oneBased ? (page - 1) * pageSize + 1 : page * pageSize + 1
  const to = total === 0 ? 0 : Math.min((oneBased ? page : page + 1) * pageSize, total)

  const goPrev = () => onPageChange(oneBased ? page - 1 : page - 1)
  const goNext = () => onPageChange(oneBased ? page + 1 : page + 1)

  return (
    <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="tabular-nums">
        {total === 0 ? '0 resultados' : `${from}–${to} de ${total}`}
        {total > 0 ? (
          <span className="hidden sm:inline">
            {' '}
            · Página {displayPage} de {displayLast}
          </span>
        ) : null}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange ? (
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v))
              onPageChange(oneBased ? 1 : 0)
            }}
          >
            <SelectTrigger className="h-8 w-[5.5rem]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / pág.
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <Button type="button" size="sm" variant="outline" disabled={!canPrev} onClick={goPrev}>
          <ChevronLeft className="size-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Anterior</span>
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={!canNext} onClick={goNext}>
          <span className="sr-only sm:not-sr-only sm:mr-1">Seguinte</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
