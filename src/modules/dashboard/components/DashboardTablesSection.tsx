import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { RecentDataTable } from '@/modules/dashboard/components/RecentDataTable'
import { useRecentActivities } from '@/modules/dashboard/hooks/useRecentActivities'
import { useRecentClients } from '@/modules/dashboard/hooks/useRecentClients'
import { useRecentOrders } from '@/modules/dashboard/hooks/useRecentOrders'
import { useRecentQuotes } from '@/modules/dashboard/hooks/useRecentQuotes'
import type { RecentTableRow } from '@/modules/dashboard/types'

function activityToRows(
  items: ReturnType<typeof useRecentActivities>['items'],
): RecentTableRow[] {
  return items.slice(0, 8).map((a) => ({
    id: a.id,
    primary: a.title,
    secondary: a.description,
    meta: new Date(a.timestamp).toLocaleDateString('pt-PT'),
    statusTone: a.tone ?? 'default',
  }))
}

export function DashboardTablesSection() {
  const { isModuleEnabled } = useTenantPlatform()
  const signageEnabled = isModuleEnabled('signage')

  const orders = useRecentOrders()
  const quotes = useRecentQuotes()
  const clients = useRecentClients()
  const activities = useRecentActivities()

  const activityRows = activityToRows(activities.items)

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <RecentDataTable
        title="Pedidos recentes"
        description="Últimos pedidos da loja"
        rows={orders.rows}
        loading={orders.isLoading}
        viewAllHref="/admin/pedidos"
        emptyTitle="Nenhum pedido recente"
      />
      {signageEnabled ? (
        <RecentDataTable
          title="Contratos / orçamentos"
          description="Últimos orçamentos"
          rows={quotes.rows}
          loading={quotes.isLoading}
          viewAllHref="/admin/signage/orcamentos"
          emptyTitle="Nenhum orçamento recente"
        />
      ) : null}
      <RecentDataTable
        title="Clientes recentes"
        description="Base corporativa"
        rows={clients.rows}
        loading={clients.isLoading}
        viewAllHref="/admin/crm"
        emptyTitle="Nenhum cliente recente"
      />
      <RecentDataTable
        title="Atividades"
        description="Eventos operacionais"
        rows={activityRows}
        loading={activities.isLoading}
        emptyTitle="Sem atividades"
      />
    </section>
  )
}
