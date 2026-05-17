/* eslint-disable react-refresh/only-export-components -- manifesto de rotas admin + lazy */
import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { RequireModuleRoute } from '@/core/permissions/RequireModuleRoute'
import { PERMISSIONS } from '@/core/types/permissions'
import { RequirePermission } from '@/routes/RequirePermission'

const AdminOrdersListPage = lazy(() =>
  import('@/modules/admin/orders/pages/AdminOrdersListPage').then((m) => ({
    default: m.AdminOrdersListPage,
  })),
)
const AdminOrderDetailPage = lazy(() =>
  import('@/modules/admin/orders/pages/AdminOrderDetailPage').then((m) => ({
    default: m.AdminOrderDetailPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
import { signageRouteChildren } from '@/routes/signage.routes'

const FinancialDashboardPage = lazy(() =>
  import('@/modules/financial/pages/FinancialDashboardPage').then((m) => ({ default: m.FinancialDashboardPage })),
)
const CashFlowPage = lazy(() =>
  import('@/modules/financial/pages/CashFlowPage').then((m) => ({ default: m.CashFlowPage })),
)
const ReceivablesPage = lazy(() =>
  import('@/modules/financial/pages/ReceivablesPage').then((m) => ({ default: m.ReceivablesPage })),
)
const ReportsPage = lazy(() =>
  import('@/modules/financial/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
)

const FiscalDashboardPage = lazy(() =>
  import('@/modules/admin/fiscal/pages/FiscalDashboardPage').then((m) => ({ default: m.FiscalDashboardPage })),
)
const FiscalInvoicesListPage = lazy(() =>
  import('@/modules/admin/fiscal/pages/FiscalInvoicesListPage').then((m) => ({
    default: m.FiscalInvoicesListPage,
  })),
)
const FiscalInvoiceDetailPage = lazy(() =>
  import('@/modules/admin/fiscal/pages/FiscalInvoiceDetailPage').then((m) => ({
    default: m.FiscalInvoiceDetailPage,
  })),
)

const CrmModulePage = lazy(() => import('@/modules/crm/pages/CrmModulePage'))

export const adminRouteChildren: RouteObject[] = [
  { index: true, element: <Navigate to="/admin/dashboard" replace /> },
  {
    path: 'dashboard',
    element: (
      <RequireModuleRoute moduleId="core">
        <RequirePermission anyOf={[PERMISSIONS.DASHBOARD_VIEW]}>
          <DashboardPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'pedidos',
    element: (
      <RequireModuleRoute moduleId="orders">
        <RequirePermission anyOf={[PERMISSIONS.ORDERS_ADMIN_VIEW]}>
          <AdminOrdersListPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'pedidos/:orderId',
    element: (
      <RequireModuleRoute moduleId="orders">
        <RequirePermission anyOf={[PERMISSIONS.ORDERS_ADMIN_VIEW]}>
          <AdminOrderDetailPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'financeiro',
    element: (
      <RequireModuleRoute moduleId="financial">
        <RequirePermission anyOf={[PERMISSIONS.FINANCIAL_ADMIN_VIEW]}>
          <FinancialDashboardPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'financeiro/fluxo-caixa',
    element: (
      <RequireModuleRoute moduleId="financial">
        <RequirePermission anyOf={[PERMISSIONS.FINANCIAL_ADMIN_VIEW]}>
          <CashFlowPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'financeiro/contas-receber',
    element: (
      <RequireModuleRoute moduleId="financial">
        <RequirePermission anyOf={[PERMISSIONS.FINANCIAL_ADMIN_VIEW]}>
          <ReceivablesPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'financeiro/relatorios',
    element: (
      <RequireModuleRoute moduleId="financial">
        <RequirePermission
          anyOf={[PERMISSIONS.FINANCIAL_ADMIN_VIEW, PERMISSIONS.FINANCIAL_ADMIN_REPORTS]}
        >
          <ReportsPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'fiscal',
    element: <Navigate to="/admin/fiscal/painel" replace />,
  },
  {
    path: 'fiscal/painel',
    element: (
      <RequireModuleRoute moduleId="fiscal">
        <RequirePermission anyOf={[PERMISSIONS.FISCAL_VIEW]}>
          <FiscalDashboardPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'fiscal/notas',
    element: (
      <RequireModuleRoute moduleId="fiscal">
        <RequirePermission anyOf={[PERMISSIONS.FISCAL_VIEW]}>
          <FiscalInvoicesListPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'fiscal/notas/:invoiceId',
    element: (
      <RequireModuleRoute moduleId="fiscal">
        <RequirePermission anyOf={[PERMISSIONS.FISCAL_VIEW]}>
          <FiscalInvoiceDetailPage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  {
    path: 'crm',
    element: (
      <RequireModuleRoute moduleId="crm">
        <RequirePermission anyOf={[PERMISSIONS.DASHBOARD_VIEW]}>
          <CrmModulePage />
        </RequirePermission>
      </RequireModuleRoute>
    ),
  },
  ...signageRouteChildren,
]
