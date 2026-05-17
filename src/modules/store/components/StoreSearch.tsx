import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { listStoreCatalogProducts } from '@/modules/store/services/store-catalog.api'
import { formatCurrency } from '@/modules/signage/shared/utils/format'
import { cn } from '@/lib/utils'

type StoreSearchProps = {
  className?: string
  inputClassName?: string
  onNavigate?: () => void
}

export function StoreSearch({ className, inputClassName, onNavigate }: StoreSearchProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<{ id: number; name: string; price: number; img?: string }[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = window.setTimeout(() => {
      void listStoreCatalogProducts({ search: q, pageSize: 6 })
        .then((res) => {
          setItems(
            res.items.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.salePrice,
              img: p.imageUrls[0] ?? p.metadata.artworkUrl,
            })),
          )
        })
        .finally(() => setLoading(false))
    }, 300)
    return () => window.clearTimeout(t)
  }, [query])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const goCatalog = () => {
    const q = query.trim()
    if (!q) return
    navigate(`/produtos?q=${encodeURIComponent(q)}`)
    setOpen(false)
    onNavigate?.()
  }

  const showPanel = open && query.trim().length >= 2

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') goCatalog()
          if (e.key === 'Escape') setOpen(false)
        }}
        placeholder="Buscar produtos…"
        className={cn('h-9 min-h-11 pl-9', inputClassName)}
        aria-label="Buscar produtos"
        aria-expanded={showPanel}
        aria-controls="store-search-suggestions"
        autoComplete="off"
      />
      {showPanel ? (
        <div
          id="store-search-suggestions"
          role="listbox"
          className="border-border bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border py-1 shadow-elevated"
        >
          {loading ? (
            <p className="text-muted-foreground flex items-center gap-2 px-3 py-4 text-sm">
              <Loader2 className="size-4 animate-spin" /> A pesquisar…
            </p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground px-3 py-4 text-sm">Nenhum resultado.</p>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                role="option"
                to={`/produtos/${item.id}`}
                onClick={() => {
                  setOpen(false)
                  onNavigate?.()
                }}
                className="hover:bg-muted flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
              >
                {item.img ? (
                  <img src={item.img} alt="" className="size-10 rounded-md object-cover" loading="lazy" />
                ) : (
                  <span className="bg-muted size-10 shrink-0 rounded-md" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 font-medium">{item.name}</span>
                  <span className="text-muted-foreground text-xs">{formatCurrency(item.price)}</span>
                </span>
              </Link>
            ))
          )}
          <button
            type="button"
            className="text-primary hover:bg-muted w-full border-t px-3 py-2.5 text-left text-sm font-medium"
            onClick={goCatalog}
          >
            Ver todos os resultados
          </button>
        </div>
      ) : null}
    </div>
  )
}
