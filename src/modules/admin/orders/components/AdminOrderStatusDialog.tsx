import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { RhfSelect, RhfTextarea } from '@/components/forms'
import {
  orderStatusChangeSchema,
  type OrderStatusChangeValues,
} from '@/modules/admin/orders/schemas/orderStatusChange.schema'
import type { AdminOrderStatus } from '@/modules/admin/orders/types'

const STATUSES: AdminOrderStatus[] = [
  'pendente',
  'confirmado',
  'em_preparacao',
  'enviado',
  'entregue',
  'cancelado',
]

type AdminOrderStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  currentStatus: AdminOrderStatus
  isSubmitting: boolean
  onSubmit: (values: OrderStatusChangeValues) => void
}

export function AdminOrderStatusDialog({
  open,
  onOpenChange,
  orderId,
  currentStatus,
  isSubmitting,
  onSubmit,
}: AdminOrderStatusDialogProps) {
  const form = useForm<OrderStatusChangeValues>({
    resolver: zodResolver(orderStatusChangeSchema),
    defaultValues: { status: currentStatus, nota: '' },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      form.reset({ status: currentStatus, nota: '' })
    }
  }, [open, currentStatus, form])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Alterar estado do pedido</AlertDialogTitle>
          <AlertDialogDescription>
            Pedido <span className="text-foreground font-medium">{orderId}</span>. Esta ação fica
            registada no histórico.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          noValidate
        >
          <RhfSelect
            control={form.control}
            name="status"
            label="Novo estado"
            options={STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <RhfTextarea control={form.control} name="nota" label="Nota interna (opcional)" rows={3} />
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  A guardar…
                </>
              ) : (
                'Guardar estado'
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
