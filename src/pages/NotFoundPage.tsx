import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <p className="text-muted-foreground text-sm">Página não encontrada.</p>
      <Link
        to="/login"
        className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex')}
      >
        Ir para o login
      </Link>
    </div>
  )
}
