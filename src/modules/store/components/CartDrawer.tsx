import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useConfirmDialog } from '@/components/data-table'
import { EmptyState } from '@/components/layout/EmptyState'
import { LoadingBlock } from '@/components/feedback/LoadingBlock'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CartLineEditor } from '@/modules/ecommerce/cart/components/CartLineEditor'
import { CartSummary } from '@/modules/ecommerce/cart/components/CartSummary'
import { useCart } from '@/modules/ecommerce/cart/hooks/useCart'
import { useCartMutations } from '@/modules/ecommerce/cart/hooks/useCartMutations'
import { useCartDrawer } from '@/modules/store/components/cart-drawer-context'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const { open, setOpen } = useCartDrawer()
  const { data, isLoading } = useCart()
  const { updateQty, removeLine } = useCartMutations()
  const { confirm, dialog } = useConfirmDialog()

  const confirmRemove = (lineId: string, productName: string) => {
    confirm({
      title: 'Remover item do carrinho?',
      description: `O produto «${productName}» será removido do carrinho.`,
      destructive: true,
      onConfirm: () => removeLine.mutate(lineId),
    })
  }

  const lineCount = data?.linhas.reduce((s, l) => s + l.quantidade, 0) ?? 0

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-border/60 border-b px-4 py-4 text-left">
            <SheetTitle>Carrinho</SheetTitle>
            <SheetDescription>
              {lineCount > 0
                ? `${lineCount} ${lineCount === 1 ? 'item' : 'itens'} no carrinho`
                : 'O seu carrinho está vazio'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
            {isLoading ? (
              <LoadingBlock variant="table" className="min-h-0" />
            ) : !data || data.linhas.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="Carrinho vazio"
                description="Explore o catálogo e adicione produtos."
                action={{ label: 'Ver produtos', to: '/produtos' }}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {data.linhas.map((line) => (
                  <CartLineEditor
                    key={line.id}
                    line={line}
                    disabled={updateQty.isPending || removeLine.isPending}
                    onChangeQuantity={(id, qty) => updateQty.mutate({ lineId: id, quantidade: qty })}
                    onRemove={(id) => {
                      const row = data.linhas.find((l) => l.id === id)
                      confirmRemove(id, row?.nome ?? 'este item')
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {data && data.linhas.length > 0 ? (
            <div className="border-border/60 space-y-4 border-t px-4 py-4">
              <CartSummary cart={data} />
              <div className="flex flex-col gap-2">
                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
                >
                  Finalizar compra
                </Link>
                <Link
                  to="/carrinho"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  Ver carrinho completo
                </Link>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setOpen(false)}>
                  Continuar a comprar
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
      {dialog}
    </>
  )
}
