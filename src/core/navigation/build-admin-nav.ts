import {
  ClipboardList,
  Factory,
  FilePlus,
  FileSpreadsheet,
  FileText,
  Handshake,
  Landmark,
  LayoutDashboard,
  Palette,
  Receipt,
  ScrollText,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ModuleId } from '@/core/settings/types'
import type { Permission } from '@/core/types/permissions'
import { PERMISSIONS } from '@/core/types/permissions'

export type AdminNavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  permission?: Permission | readonly Permission[]
  matchExact?: boolean
}

export type AdminNavDefinition = AdminNavItem & {
  moduleId: ModuleId
}

export const ADMIN_NAV_DEFINITIONS: readonly AdminNavDefinition[] = [
  {
    id: 'dashboard',
    label: 'Painel',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: PERMISSIONS.DASHBOARD_VIEW,
    moduleId: 'core',
  },
  {
    id: 'orders',
    label: 'Pedidos',
    path: '/admin/pedidos',
    icon: ClipboardList,
    permission: PERMISSIONS.ORDERS_ADMIN_VIEW,
    moduleId: 'orders',
  },
  {
    id: 'financial',
    label: 'Financeiro',
    path: '/admin/financeiro',
    icon: Wallet,
    permission: PERMISSIONS.FINANCIAL_ADMIN_VIEW,
    matchExact: true,
    moduleId: 'financial',
  },
  {
    id: 'financial-cashflow',
    label: 'Fluxo de caixa',
    path: '/admin/financeiro/fluxo-caixa',
    icon: Landmark,
    permission: PERMISSIONS.FINANCIAL_ADMIN_VIEW,
    moduleId: 'financial',
  },
  {
    id: 'financial-receivables',
    label: 'Contas a receber',
    path: '/admin/financeiro/contas-receber',
    icon: Receipt,
    permission: PERMISSIONS.FINANCIAL_ADMIN_VIEW,
    moduleId: 'financial',
  },
  {
    id: 'financial-reports',
    label: 'Relatórios',
    path: '/admin/financeiro/relatorios',
    icon: FileSpreadsheet,
    permission: [PERMISSIONS.FINANCIAL_ADMIN_VIEW, PERMISSIONS.FINANCIAL_ADMIN_REPORTS],
    moduleId: 'financial',
  },
  {
    id: 'fiscal-dashboard',
    label: 'Painel fiscal',
    path: '/admin/fiscal/painel',
    icon: ScrollText,
    permission: PERMISSIONS.FISCAL_VIEW,
    matchExact: true,
    moduleId: 'fiscal',
  },
  {
    id: 'fiscal-invoices',
    label: 'Notas fiscais',
    path: '/admin/fiscal/notas',
    icon: FileText,
    permission: PERMISSIONS.FISCAL_VIEW,
    moduleId: 'fiscal',
  },
  {
    id: 'signage-products',
    label: 'Produtos',
    path: '/admin/signage/produtos',
    icon: Palette,
    permission: PERMISSIONS.CATALOG_READ,
    moduleId: 'signage',
  },
  {
    id: 'signage-quotes',
    label: 'Orçamentos',
    path: '/admin/signage/orcamentos',
    icon: FilePlus,
    permission: PERMISSIONS.QUOTES_READ,
    moduleId: 'signage',
  },
  {
    id: 'signage-production',
    label: 'Produção',
    path: '/admin/signage/producao',
    icon: Factory,
    permission: PERMISSIONS.PRODUCTION_READ,
    moduleId: 'signage',
  },
  {
    id: 'signage-installation',
    label: 'Instalação',
    path: '/admin/signage/instalacoes',
    icon: Truck,
    permission: PERMISSIONS.INSTALLATION_READ,
    moduleId: 'signage',
  },
  {
    id: 'signage-resale',
    label: 'Revenda',
    path: '/admin/signage/revenda',
    icon: Handshake,
    permission: PERMISSIONS.PARTNERS_READ,
    moduleId: 'signage',
  },
  {
    id: 'crm',
    label: 'CRM / Clientes',
    path: '/admin/crm',
    icon: Users,
    permission: PERMISSIONS.DASHBOARD_VIEW,
    moduleId: 'crm',
  },
] as const
