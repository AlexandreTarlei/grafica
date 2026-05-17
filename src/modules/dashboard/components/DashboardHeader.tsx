import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DashboardHeaderProps = {
  userName?: string | null
  actions?: ReactNode
}

export function DashboardHeader({ userName, actions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="page-title">Olá, {userName ?? 'equipa'}</h1>
        <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed">
          Visão executiva do negócio — indicadores, tendências e atividade recente num só lugar.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        {actions}
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/financeiro" className={cn(buttonVariants({ size: 'sm' }))}>
            Financeiro
          </Link>
          <Link to="/admin/pedidos" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            Pedidos
          </Link>
        </div>
      </div>
    </div>
  )
}
