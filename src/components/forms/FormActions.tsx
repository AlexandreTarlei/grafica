import type { ReactNode } from 'react'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FormActionsProps = {
  submitLabel?: string
  loading?: boolean
  onCancel?: () => void
  cancelLabel?: string
  children?: ReactNode
  className?: string
}

export function FormActions({
  submitLabel = 'Guardar',
  loading,
  onCancel,
  cancelLabel = 'Cancelar',
  children,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 border-t border-border/60 pt-4',
        className,
      )}
    >
      <Button type="submit" disabled={loading} className="gap-2">
        {loading ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            A guardar…
          </>
        ) : (
          submitLabel
        )}
      </Button>
      {onCancel ? (
        <Button type="button" variant="outline" disabled={loading} onClick={onCancel}>
          {cancelLabel}
        </Button>
      ) : null}
      {children}
    </div>
  )
}
