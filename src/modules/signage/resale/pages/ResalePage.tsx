import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Handshake, Package } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { MetricCard } from '@/components/metrics/MetricCard'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import {
  getResaleDashboard,
  resaleDashboardKey,
  type ResaleOrder,
  type ResalePartner,
} from '@/modules/signage/resale/services/resale.api'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { formatCurrency } from '@/modules/signage/shared/utils/format'

export function ResalePage() {
  const companyId = useCurrentCompanyId()

  const { data, isLoading } = useQuery({
    queryKey: resaleDashboardKey(companyId),
    queryFn: () => getResaleDashboard(companyId as number),
    enabled: companyId != null,
  })

  const partnerColumns = useMemo<ColumnDef<ResalePartner>[]>(
    () => [
      { header: 'Parceiro', accessorKey: 'name', cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span> },
      {
        header: 'Desconto',
        cell: ({ row }) => <span className="tabular-nums">{row.original.discountPercent}%</span>,
      },
      {
        header: 'Ocultar marca',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.hideBrand ? 'Sim' : 'Não'}
            tone={row.original.hideBrand ? 'info' : 'muted'}
          />
        ),
      },
      { header: 'Pedidos ativos', accessorKey: 'activeOrders', meta: { className: 'hidden md:table-cell' } },
    ],
    [],
  )

  const orderColumns = useMemo<ColumnDef<ResaleOrder>[]>(
    () => [
      { header: 'Parceiro', accessorKey: 'partnerName' },
      { header: 'Total', cell: ({ row }) => <span className="tabular-nums">{formatCurrency(row.original.total)}</span> },
      { header: 'Estado', accessorKey: 'status' },
    ],
    [],
  )

  return (
    <PageShell title="White label / Revenda" subtitle="Parceiros, tabela diferenciada e pedidos sem marca.">
      <ResaleMetrics data={data} loading={isLoading} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="section-title text-base">Parceiros</h2>
          <DataTable
            columns={partnerColumns}
            data={data?.partners ?? []}
            loading={isLoading}
            emptyState={{ title: 'Sem parceiros', description: 'Nenhum parceiro de revenda registado.' }}
          />
        </div>
        <div className="space-y-3">
          <h2 className="section-title text-base">Pedidos white label</h2>
          <DataTable
            columns={orderColumns}
            data={data?.orders ?? []}
            loading={isLoading}
            emptyState={{ title: 'Sem pedidos', description: 'Nenhum pedido white label no período.' }}
          />
        </div>
      </div>
    </PageShell>
  )
}

function ResaleMetrics({
  data,
  loading,
}: {
  data?: { revenueMonth: number; partners: unknown[] }
  loading: boolean
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MetricCard
        title="Faturamento revenda (mês)"
        value={data ? formatCurrency(data.revenueMonth) : '—'}
        icon={Handshake}
        loading={loading}
      />
      <MetricCard
        title="Parceiros ativos"
        value={data ? String(data.partners.length) : '—'}
        icon={Package}
        loading={loading}
      />
    </div>
  )
}
