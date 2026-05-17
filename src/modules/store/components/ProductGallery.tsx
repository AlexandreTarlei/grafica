import { useEffect, useState } from 'react'
import { ImageIcon, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProductGalleryProps = {
  images: string[]
  alt?: string
  className?: string
}

export function ProductGallery({ images, alt = '', className }: ProductGalleryProps) {
  const urls = images.filter(Boolean)
  const [active, setActive] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  const current = urls[active]

  useEffect(() => {
    if (!zoomOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [zoomOpen])

  if (!urls.length) {
    return (
      <div
        className={cn(
          'bg-muted text-muted-foreground flex aspect-square items-center justify-center rounded-2xl ring-1 ring-border/60',
          className,
        )}
      >
        <ImageIcon className="size-16 opacity-40" />
        <span className="sr-only">Sem imagem</span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="group relative overflow-hidden rounded-2xl ring-1 ring-border/60 shadow-card">
        <button
          type="button"
          className="block w-full cursor-zoom-in"
          onClick={() => setZoomOpen(true)}
          aria-label="Ampliar imagem"
        >
          <img
            src={current}
            alt={alt}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
            loading="lazy"
            decoding="async"
            width={800}
            height={800}
          />
        </button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-3 bottom-3 size-9 opacity-90"
          onClick={() => setZoomOpen(true)}
          aria-label="Zoom"
        >
          <ZoomIn className="size-4" />
        </Button>
      </div>
      {urls.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'ring-border/60 shrink-0 overflow-hidden rounded-lg ring-2 transition-base',
                i === active ? 'ring-primary' : 'opacity-70 hover:opacity-100',
              )}
              aria-label={`Imagem ${i + 1}`}
              aria-current={i === active}
            >
              <img
                src={url}
                alt=""
                className="size-16 object-cover sm:size-20"
                loading="lazy"
                decoding="async"
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      ) : null}

      {zoomOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal
          aria-label="Imagem ampliada"
          onClick={() => setZoomOpen(false)}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setZoomOpen(false)}
            aria-label="Fechar"
          >
            <X className="size-4" />
          </Button>
          <img
            src={current}
            alt={alt}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}
