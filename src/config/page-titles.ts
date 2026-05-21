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
  { prefix: '/admin/signage/orcamentos/novo', title: 'Novo orçamento' },
  { prefix: '/admin/signage/orcamentos/', title: 'Orçamento' },
  { prefix: '/admin/signage/orcamentos', title: 'Orçamentos' },
  { prefix: '/admin/signage/produtos/novo', title: 'Novo produto' },
  { prefix: '/admin/signage/produtos/', title: 'Produto' },
  { prefix: '/admin/signage/produtos', title: 'Produtos' },
  { prefix: '/admin/signage/producao', title: 'Produção' },
  { prefix: '/admin/signage/instalacoes/', title: 'Instalação' },
  { prefix: '/admin/signage/instalacoes', title: 'Instalações' },
  { prefix: '/admin/signage/clientes', title: 'Clientes' },
  { prefix: '/admin/signage/revenda', title: 'Revenda' },
  { prefix: '/admin/signage/categorias', title: 'Categorias' },
  { prefix: '/admin/fiscal/', title: 'Nota fiscal' },
  { prefix: '/admin/fiscal', title: 'Fiscal' },
]

export function getPageTitle(pathname: string): string {
  const hit = ROUTE_TITLES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`))
  return hit?.title ?? 'Área administrativa'
}

/** Segmento atual para breadcrumb na navbar admin (H1 fica na página via PageShell). */
export function getAdminBreadcrumbCurrent(pathname: string): string {
  return getPageTitle(pathname)
}
