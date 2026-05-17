import {
  Banknote,
  Boxes,
  FileSignature,
  MapPin,
  Package,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { KpiStatCard } from '@/modules/dashboard/components/KpiStatCard'
import type { DashboardSnapshot } from '@/modules/dashboard/types'
import {
  formatCurrencyEUR,
  formatNumberPt,
} from '@/modules/financial/utils/format'

type KpiStatGridProps = {
  data?: DashboardSnapshot | null
  loading?: boolean
}

export function KpiStatGrid({ data, loading }: KpiStatGridProps) {
  const items = [
    {
      id: 'revenue' as const,
      title: 'Faturamento',
      value: data ? formatCurrencyEUR(data.revenue) : '—',
      description: 'No período',
      icon: TrendingUp,
      href: '/admin/financeiro',
      deltaLabel: data ? '+8% vs período anterior' : undefined,
      trend: 'up' as const,
    },
    {
      id: 'sales' as const,
      title: 'Vendas',
      value: data ? formatCurrencyEUR(data.salesTotal) : '—',
      description: 'Volume no período',
      icon: Banknote,
      href: '/admin/financeiro',
      trend: 'up' as const,
      deltaLabel: data ? '+5% vs período anterior' : undefined,
    },
    {
      id: 'contracts' as const,
      title: 'Contratos',
      value: data ? formatNumberPt(data.contratos) : '—',
      description: 'Orçamentos aprovados / ativos',
      icon: FileSignature,
      href: '/admin/signage/orcamentos',
    },
    {
      id: 'rentals' as const,
      title: 'Locações',
      value: data ? formatNumberPt(data.locacoes) : '—',
      description: 'Instalações e aluguer ativo',
      icon: MapPin,
      href: '/admin/signage/instalacoes',
    },
    {
      id: 'clients' as const,
      title: 'Clientes',
      value: data ? formatNumberPt(data.clientes) : '—',
      description: 'Base ativa estimada',
      icon: Users,
      href: '/admin/crm',
    },
    {
      id: 'products' as const,
      title: 'Produtos',
      value: data ? formatNumberPt(data.produtos) : '—',
      description: 'Catálogo ativo',
      icon: Package,
      href: '/admin/signage/produtos',
    },
    {
      id: 'inventory' as const,
      title: 'Estoque',
      value: data ? formatNumberPt(data.estoqueBaixo) : '—',
      description: data
        ? `${formatNumberPt(data.estoqueTotal)} SKUs no total · críticos`
        : 'SKUs abaixo do mínimo',
      icon: Boxes,
      trend: data && data.estoqueBaixo > 10 ? ('down' as const) : ('neutral' as const),
    },
    {
      id: 'cashflow' as const,
      title: 'Fluxo financeiro',
      value: data ? formatCurrencyEUR(data.fluxoLiquido) : '—',
      description: 'Saldo acumulado no período',
      icon: Wallet,
      href: '/admin/financeiro/fluxo-caixa',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8">
      {items.map((item) => (
        <KpiStatCard
          key={item.id}
          variant={item.id}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
          href={item.href}
          loading={loading}
          deltaLabel={item.deltaLabel}
          trend={item.trend}
        />
      ))}
    </div>
  )
}
