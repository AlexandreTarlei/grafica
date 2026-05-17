import { cn } from '@/lib/utils'

type ArtworkPreviewProps = {
  imageUrl?: string | null
  widthCm?: number
  heightCm?: number
  label?: string
  className?: string
}

export function ArtworkPreview({
  imageUrl,
  widthCm = 100,
  heightCm = 50,
  label,
  className,
}: ArtworkPreviewProps) {
  const ratio = widthCm / Math.max(heightCm, 1)
  const boxW = ratio >= 1 ? 280 : 280 * ratio
  const boxH = ratio >= 1 ? 280 / ratio : 280

  return (
    <div className={cn('space-y-2', className)}>
      {label ? <p className="text-muted-foreground text-xs font-medium">{label}</p> : null}
      <div
        className="bg-muted/30 border-border relative mx-auto overflow-hidden rounded-lg border"
        style={{ width: boxW, height: boxH, maxWidth: '100%' }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="size-full object-contain" />
        ) : (
          <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-1 p-4 text-center text-xs">
            <span>Pré-visualização</span>
            <span>
              {widthCm} × {heightCm} cm
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
