/** Títulos exibidos na navbar admin (prefixo mais específico primeiro). */
const ROUTE_TITLES: readonly { prefix: string; title: string }[] = [
  { prefix: '/admin/pedidos/', title: 'Pedido' },
  { prefix: '/admin/pedidos', title: 'Pedidos' },
  { prefix: '/admin/financeiro/relatorios', title: 'Relatórios financeiros' },
  { prefix: '/admin/financeiro/contas-receber', title: 'Contas a receber' },
  { prefix: '/admin/financeiro/fluxo-caixa', title: 'Fluxo de caixa' },
  { prefix: '/admin/financeiro', title: 'Financeiro' },
  { prefix: '/admin/suporte', title: 'Suporte' },
  { prefix: '/admin/crm', title: 'CRM' },
  { prefix: '/admin/contratos', title: 'Contratos' },
  { prefix: '/admin/locacao', title: 'Locação' },
  { prefix: '/admin/dashboard', title: 'Painel' },
]

export function getPageTitle(pathname: string): string {
  const hit = ROUTE_TITLES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`))
  return hit?.title ?? 'Área administrativa'
}
