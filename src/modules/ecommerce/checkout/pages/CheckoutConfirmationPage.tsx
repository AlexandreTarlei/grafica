import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function CheckoutConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()

  return (
    <PageContainer noMotion className="flex justify-center py-12">
      <Card className="w-full max-w-lg border-primary/20 shadow-elevated ring-1 ring-border/60">
        <CardHeader className="text-center">
          <div className="text-primary mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="size-8" />
          </div>
          <CardTitle className="text-2xl">Encomenda confirmada</CardTitle>
          <CardDescription>
            Obrigado pela sua compra. Guarde o número da encomenda para referência.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 text-center">
          <div>
            <p className="text-muted-foreground text-sm">Número da encomenda</p>
            <p className="text-foreground mt-1 font-mono text-xl font-semibold tracking-tight">{orderId}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/produtos" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
              Continuar a comprar
            </Link>
            <Link
              to="/conta/pedidos"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2')}
            >
              <Package className="size-4" />
              Ver os meus pedidos
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
