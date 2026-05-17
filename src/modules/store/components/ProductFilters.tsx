import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { STORE_CATEGORIES } from '@/modules/store/content/ecommerce-content'
import type { SignageProductCategory } from '@/modules/signage/products/types'
import { cn } from '@/lib/utils'

export type CatalogSort = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: 'name-asc', label: 'Nome (A–Z)' },
  { value: 'name-desc', label: 'Nome (Z–A)' },
  { value: 'price-asc', label: 'Preço (menor)' },
  { value: 'price-desc', label: 'Preço (maior)' },
]

export function parseCatalogSort(raw: string | null): CatalogSort {
  if (raw === 'name-desc' || raw === 'price-asc' || raw === 'price-desc') return raw
  return 'name-asc'
}

type ProductFiltersProps = {
  resultCount?: number
  className?: string
}

export function ProductFilters({ resultCount, className }: ProductFiltersProps) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const categoria = (params.get('categoria') ?? '') as SignageProductCategory | ''
  const sort = parseCatalogSort(params.get('sort'))
  const [search, setSearch] = useState(q)

  useEffect(() => {
    setSearch(q)
  }, [q])

  useEffect(() => {
    const t = window.setTimeout(() => {
      const trimmed = search.trim()
      if (trimmed === q) return
      const next = new URLSearchParams(params)
      if (trimmed) next.set('q', trimmed)
      else next.delete('q')
      next.delete('page')
      setParams(next, { replace: true })
    }, 300)
    return () => window.clearTimeout(t)
  }, [search, q, params, setParams])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  const clearFilters = () => {
    setSearch('')
    setParams(new URLSearchParams())
  }

  const hasFilters = Boolean(q || categoria || sort !== 'name-asc')
  const sortLabel = useMemo(() => SORT_OPTIONS.find((o) => o.value === sort)?.label, [sort])

  return (
    <div
      className={cn(
        'bg-background/95 border-border/60 sticky top-14 z-30 -mx-4 border-b px-4 py-4 backdrop-blur-sm md:-mx-6 md:px-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="catalog-search">Buscar</Label>
          <Input
            id="catalog-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nome ou referência…"
          />
        </div>
        <div className="flex flex-col gap-2 sm:min-w-[180px]">
          <Label htmlFor="catalog-category">Categoria</Label>
          <select
            id="catalog-category"
            value={categoria}
            onChange={(e) => updateParam('categoria', e.target.value)}
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          >
            <option value="">Todas</option>
            {STORE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 sm:min-w-[180px]">
          <Label htmlFor="catalog-sort">Ordenar</Label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {hasFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="lg:mb-0.5">
            Limpar
          </Button>
        ) : null}
      </div>
      <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
        <SlidersHorizontal className="size-4 shrink-0" />
        {typeof resultCount === 'number' ? (
          <span>
            {resultCount} {resultCount === 1 ? 'produto' : 'produtos'}
            {sortLabel ? ` · ${sortLabel}` : ''}
          </span>
        ) : (
          <span>Filtros activos</span>
        )}
      </div>
    </div>
  )
}
