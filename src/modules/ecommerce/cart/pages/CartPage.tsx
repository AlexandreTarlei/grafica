import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShoppingCart } from 'lucide-react'
import { useConfirmDialog } from '@/components/data-table'
import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingBlock } from '@/components/feedback/LoadingBlock'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CartLineEditor } from '@/modules/ecommerce/cart/components/CartLineEditor'
import { CartSummary } from '@/modules/ecommerce/cart/components/CartSummary'
import { useCart } from '@/modules/ecommerce/cart/hooks/useCart'
import { useCartMutations } from '@/modules/ecommerce/cart/hooks/useCartMutations'
import { cn } from '@/lib/utils'

const isDev = import.meta.env.DEV

export function CartPage() {
  const { data, isLoading } = useCart()
  const { updateQty, removeLine, addItem } = useCartMutations()
  const { confirm, dialog } = useConfirmDialog()
  const [pid, setPid] = useState('demo')

  const confirmRemove = (lineId: string, productName: string) => {
    confirm({
      title: 'Remover item do carrinho?',
      description: `O produto «${productName}» será removido do carrinho.`,
      destructive: true,
      onConfirm: () => removeLine.mutate(lineId),
    })
  }

  return (
    <PageContainer>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="flex flex-col gap-6">
          <PageHeader
            noMotion
            title="Carrinho"
            description="Revise os itens antes de finalizar o pedido."
          />

          {isLoading ? (
            <LoadingBlock variant="table" className="min-h-0" />
          ) : data && data.linhas.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Carrinho vazio"
              description="Adicione produtos ao carrinho para continuar com o pedido."
              action={{ label: 'Ver produtos', to: '/produtos' }}
            >
              {isDev ? (
                <div className="mt-6 flex w-full max-w-sm gap-2">
                  <Input value={pid} onChange={(e) => setPid(e.target.value)} placeholder="ID produto" />
                  <Button
                    type="button"
                    disabled={addItem.isPending}
                    onClick={() => addItem.mutate({ productId: pid.trim() || 'demo', quantidade: 1 })}
                  >
                    <Plus className="size-4" />
                    Adicionar
                  </Button>
                </div>
              ) : null}
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-3">
              {data?.linhas.map((line) => (
                <CartLineEditor
                  key={line.id}
                  line={line}
                  disabled={updateQty.isPending || removeLine.isPending}
                  onChangeQuantity={(id, qty) => updateQty.mutate({ lineId: id, quantidade: qty })}
                  onRemove={(id) => {
                    const row = data?.linhas.find((l) => l.id === id)
                    confirmRemove(id, row?.nome ?? 'este item')
                  }}
                />
              ))}
              {isDev ? (
                <Card className="ring-1 ring-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Adicionar item (mock)</CardTitle>
                  </CardHeader>
                  <CardContent className="flex max-w-md flex-wrap gap-2">
                    <Input value={pid} onChange={(e) => setPid(e.target.value)} placeholder="ID produto" />
                    <Button
                      type="button"
                      size="sm"
                      disabled={addItem.isPending}
                      onClick={() => addItem.mutate({ productId: pid.trim() || 'demo', quantidade: 1 })}
                    >
                      Adicionar
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}
        </div>

        {data && data.linhas.length > 0 ? (
          <div className="flex flex-col gap-4">
            <CartSummary cart={data} />
            <Link
              to="/checkout"
              className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
            >
              Continuar para checkout
            </Link>
            <Link to="/produtos" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
              Continuar a comprar
            </Link>
          </div>
        ) : null}
      </div>
      {dialog}
    </PageContainer>
  )
}
