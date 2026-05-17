import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { RhfTextarea } from '@/components/forms'
import {
  cancelInvoiceSchema,
  type CancelInvoiceValues,
} from '@/modules/admin/fiscal/schemas/cancelInvoice.schema'

type CancelInvoiceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceLabel: string
  isSubmitting: boolean
  onSubmit: (values: CancelInvoiceValues) => void
}

export function CancelInvoiceDialog({
  open,
  onOpenChange,
  invoiceLabel,
  isSubmitting,
  onSubmit,
}: CancelInvoiceDialogProps) {
  const form = useForm<CancelInvoiceValues>({
    resolver: zodResolver(cancelInvoiceSchema),
    defaultValues: { justificativa: '' },
    mode: 'onBlur',
  })

  const justificativa = useWatch({ control: form.control, name: 'justificativa' }) ?? ''

  useEffect(() => {
    if (open) form.reset({ justificativa: '' })
  }, [open, form])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar nota fiscal</AlertDialogTitle>
          <AlertDialogDescription>
            Vai cancelar a nota <span className="text-foreground font-medium">{invoiceLabel}</span>.
            Esta operação é registada na SEFAZ e não pode ser desfeita. Indique a justificativa
            (mínimo 15 caracteres).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          noValidate
        >
          <RhfTextarea
            control={form.control}
            name="justificativa"
            label="Justificativa"
            rows={4}
            placeholder="Ex.: cancelamento solicitado pelo cliente por erro na descrição do item."
          />
          <p
            className={`text-muted-foreground text-right text-xs ${justificativa.trim().length < 15 ? 'text-destructive' : ''}`}
          >
            {justificativa.trim().length}/255
          </p>
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || !form.formState.isValid}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />A cancelar…
                </>
              ) : (
                'Confirmar cancelamento'
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
