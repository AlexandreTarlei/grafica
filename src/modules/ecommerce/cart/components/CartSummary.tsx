import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Cart } from '@/modules/ecommerce/cart/types'

function money(n: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n)
}

export function CartSummary({ cart }: { cart: Cart }) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-base">Resumo</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">{money(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxas / IVA</span>
          <span className="tabular-nums">{money(cart.taxas)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{money(cart.total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
