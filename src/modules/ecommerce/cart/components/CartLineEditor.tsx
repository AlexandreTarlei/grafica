import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CartLine } from '@/modules/ecommerce/cart/types'

function money(n: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n)
}

type CartLineEditorProps = {
  line: CartLine
  disabled?: boolean
  onChangeQuantity: (lineId: string, qty: number) => void
  onRemove: (lineId: string) => void
}

export function CartLineEditor({
  line,
  disabled,
  onChangeQuantity,
  onRemove,
}: CartLineEditorProps) {
  const c = line.customization

  return (
    <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-medium">{line.nome}</p>
        <p className="text-muted-foreground text-xs">{line.sku}</p>
        {c?.widthCm != null && c?.heightCm != null ? (
          <p className="text-muted-foreground text-xs">
            Medidas: {c.widthCm} × {c.heightCm} cm
          </p>
        ) : null}
        {c?.notes ? (
          <p className="text-muted-foreground line-clamp-2 text-xs">{c.notes}</p>
        ) : null}
        {c?.artworkAssetId != null ? (
          <p className="text-muted-foreground text-xs">Arte anexada (#{c.artworkAssetId})</p>
        ) : null}
        <p className="text-muted-foreground mt-1 text-sm">{money(line.precoUnitario)} / un.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Qtd</span>
          <Input
            key={`${line.id}-${line.quantidade}`}
            type="number"
            min={1}
            className="h-9 w-20"
            disabled={disabled}
            defaultValue={String(line.quantidade)}
            onBlur={(e) => {
              const q = Number.parseInt(e.currentTarget.value, 10)
              if (!Number.isFinite(q) || q < 1) {
                e.currentTarget.value = String(line.quantidade)
                return
              }
              if (q !== line.quantidade) onChangeQuantity(line.id, q)
            }}
          />
        </div>
        <p className="text-sm font-semibold tabular-nums sm:min-w-[5rem] sm:text-right">
          {money(line.subtotal)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive"
          disabled={disabled}
          onClick={() => onRemove(line.id)}
          aria-label="Remover linha"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}