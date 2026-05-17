import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Calendar, ClipboardList, Factory, FileText, TrendingUp } from 'lucide-react'
import { MetricCard } from '@/components/metrics/MetricCard'
import { buttonVariants } from '@/components/ui/button'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { DashboardBarChart } from '@/modules/dashboard/charts/DashboardBarChart'
import { DashboardChartCard } from '@/modules/dashboard/components/DashboardChartCard'
import {
  fetchSignageDashboard,
  signageDashboardKey,
} from '@/modules/signage/dashboard/services/signage-dashboard.api'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { formatCurrency, formatNumber } from '@/modules/signage/shared/utils/format'
import { cn } from '@/lib/utils'

type SignageOperationalSectionProps = {
  /** `compact` omite KPIs duplicados (já no grid principal do dashboard). */
  variant?: 'default' | 'compact'
}

export function SignageOperationalSection({ variant = 'default' }: SignageOperationalSectionProps) {
  const companyId = useCurrentCompanyId()
  const { data, isLoading } = useQuery({
    queryKey: signageDashboardKey(companyId),
    queryFn: () => fetchSignageDashboard(companyId as number),
    enabled: companyId != null,
    staleTime: 60_000,
  })

  const funnelData =
    data?.productionFunnel.map((f) => ({ label: f.stage, value: f.count })) ?? []
  const quotesData =
    data?.quotesByStatus.map((q) => ({ label: q.status, value: q.count })) ?? []

  return (
    <section className={cn('flex flex-col gap-6', variant === 'compact' ? 'border-t pt-6' : 'border-t pt-8')}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader compact={variant === 'compact'} />
        <QuickLinks />
      </div>

      {variant === 'default' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            title="Em produção"
            value={data ? formatNumber(data.ordersInProduction) : '—'}
            icon={Factory}
            loading={isLoading}
          />
          <MetricCard
            title="Instalações hoje"
            value={data ? formatNumber(data.installationsToday) : '—'}
            icon={Calendar}
            loading={isLoading}
          />
          <MetricCard
            title="Orçamentos pendentes"
            value={data ? formatNumber(data.pendingQuotes) : '—'}
            icon={FileText}
            loading={isLoading}
          />
          <MetricCard
            title="Faturamento hoje"
            value={data ? formatCurrency(data.revenueToday) : '—'}
            icon={TrendingUp}
            loading={isLoading}
          />
          <MetricCard
            title="Produção hoje"
            value={data ? formatNumber(data.productionToday) : '—'}
            icon={ClipboardList}
            loading={isLoading}
          />
          <MetricCard
            title="Atrasados"
            value={data ? formatNumber(data.overdueOrders) : '—'}
            icon={AlertTriangle}
            loading={isLoading}
            deltaLabel={data?.overdueOrders ? 'Requer atenção' : undefined}
          />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardChartCard title="Funil de produção" description="Distribuição por etapa" loading={isLoading}>
          {funnelData.length > 0 ? <DashboardBarChart data={funnelData} /> : null}
        </DashboardChartCard>
        <DashboardChartCard title="Orçamentos por estado" loading={isLoading}>
          {quotesData.length > 0 ? (
            <DashboardBarChart data={quotesData} color="var(--chart-2)" />
          ) : null}
        </DashboardChartCard>
      </div>

      {variant === 'default' && data?.operationalStatus?.length ? (
        <div className="flex flex-wrap gap-2">
          {data.operationalStatus.map((s) => (
            <StatusBadge key={s.label} label={s.label} tone={s.tone} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

function SectionHeader({ compact }: { compact?: boolean }) {
  return (
    <div>
      <h2 className={cn('font-semibold tracking-tight', compact ? 'text-base' : 'text-lg')}>
        Operacional — Comunicação visual
      </h2>
      <p className="text-muted-foreground text-sm">
        {compact ? 'Detalhe de produção e orçamentos.' : 'Produção, instalações e orçamentos em tempo real.'}
      </p>
    </div>
  )
}

function QuickLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link to="/admin/signage/producao" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
        Produção
      </Link>
      <Link to="/admin/signage/orcamentos" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
        Orçamentos
      </Link>
      <Link to="/admin/signage/instalacoes" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
        Instalações
      </Link>
    </div>
  )
}
