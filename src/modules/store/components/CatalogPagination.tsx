import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 24

type CatalogPaginationProps = {
  total: number
  className?: string
}

export function CatalogPagination({ total, className }: CatalogPaginationProps) {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  if (totalPages <= 1) return null

  const setPage = (p: number) => {
    const next = new URLSearchParams(params)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      className={cn('mt-8 flex items-center justify-center gap-2', className)}
      aria-label="Paginação do catálogo"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" />
        Anterior
      </Button>
      <span className="text-muted-foreground px-2 text-sm tabular-nums">
        {page} / {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        aria-label="Página seguinte"
      >
        Seguinte
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}

export const CATALOG_PAGE_SIZE = PAGE_SIZE
