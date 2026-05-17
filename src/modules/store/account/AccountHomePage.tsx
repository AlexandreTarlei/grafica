import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function AccountHomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Olá, {user?.name ?? user?.email}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>Gerencie os seus pedidos, aprove artes e descarregue documentos.</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/conta/pedidos"
          className={cn(buttonVariants({ variant: 'outline' }), 'h-auto flex-col items-start p-4')}
        >
          <span className="font-semibold">Pedidos</span>
          <span className="text-muted-foreground text-xs font-normal">Histórico e estado</span>
        </Link>
        <Link
          to="/orcamento"
          className={cn(buttonVariants({ variant: 'outline' }), 'h-auto flex-col items-start p-4')}
        >
          <span className="font-semibold">Novo orçamento</span>
          <span className="text-muted-foreground text-xs font-normal">Pedido personalizado</span>
        </Link>
      </div>
    </div>
  )
}
