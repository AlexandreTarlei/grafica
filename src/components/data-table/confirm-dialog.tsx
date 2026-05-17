import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
  destructive?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  loading,
  destructive,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? 'destructive' : 'default'}
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            {loading ? 'A processar…' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean
    title: string
    description?: string
    onConfirm: () => void | Promise<void>
    destructive?: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const confirm = (opts: Omit<NonNullable<typeof state>, 'open'>) => {
    setState({ ...opts, open: true })
  }

  const dialog = state ? (
    <ConfirmDialog
      open={state.open}
      onOpenChange={(open) => {
        if (!open) setState(null)
      }}
      title={state.title}
      description={state.description}
      destructive={state.destructive}
      loading={loading}
      onConfirm={async () => {
        setLoading(true)
        try {
          await state.onConfirm()
          setState(null)
        } finally {
          setLoading(false)
        }
      }}
    />
  ) : null

  return { confirm, dialog }
}
