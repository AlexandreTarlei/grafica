import { Loader2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type EmitInvoiceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderLabel: string
  /** Texto adicional opcional (ex.: "Re-emitir após rejeição"). */
  intent?: 'emit' | 'resend'
  isSubmitting: boolean
  onConfirm: () => void
}

export function EmitInvoiceDialog({
  open,
  onOpenChange,
  orderLabel,
  intent = 'emit',
  isSubmitting,
  onConfirm,
}: EmitInvoiceDialogProps) {
  const title = intent === 'resend' ? 'Reenviar nota fiscal' : 'Emitir nota fiscal'
  const description =
    intent === 'resend'
      ? `Vai reenviar a emissão da nota associada ao pedido ${orderLabel}. O provider tentará novamente junto da SEFAZ.`
      : `Vai emitir manualmente a nota fiscal do pedido ${orderLabel}. A emissão é processada em segundo plano.`

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />A enviar…
              </>
            ) : (
              'Confirmar emissão'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
