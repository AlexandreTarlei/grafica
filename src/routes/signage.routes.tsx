/* eslint-disable react-refresh/only-export-components -- manifesto de rotas signage */
import { lazy, type ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { RequireModuleRoute } from '@/core/permissions/RequireModuleRoute'
import { PERMISSIONS, type Permission } from '@/core/types/permissions'
import { RequirePermission } from '@/routes/RequirePermission'

const SignageProductsListPage = lazy(() =>
  import('@/modules/signage/products/pages/SignageProductsListPage').then((m) => ({
    default: m.SignageProductsListPage,
  })),
)
const SignageProductCreatePage = lazy(() =>
  import('@/modules/signage/products/pages/SignageProductCreatePage').then((m) => ({
    default: m.SignageProductCreatePage,
  })),
)
const SignageProductDetailPage = lazy(() =>
  import('@/modules/signage/products/pages/SignageProductDetailPage').then((m) => ({
    default: m.SignageProductDetailPage,
  })),
)
const SignageCategoriesPage = lazy(() =>
  import('@/modules/signage/products/pages/SignageCategoriesPage').then((m) => ({
    default: m.SignageCategoriesPage,
  })),
)
const QuotesListPage = lazy(() =>
  import('@/modules/signage/quotes/pages/QuotesListPage').then((m) => ({ default: m.QuotesListPage })),
)
const QuoteCreatePage = lazy(() =>
  import('@/modules/signage/quotes/pages/QuoteCreatePage').then((m) => ({ default: m.QuoteCreatePage })),
)
const QuoteDetailPage = lazy(() =>
  import('@/modules/signage/quotes/pages/QuoteDetailPage').then((m) => ({ default: m.QuoteDetailPage })),
)
const ProductionKanbanPage = lazy(() =>
  import('@/modules/signage/production/pages/ProductionKanbanPage').then((m) => ({
    default: m.ProductionKanbanPage,
  })),
)
const InstallationsListPage = lazy(() =>
  import('@/modules/signage/installation/pages/InstallationsListPage').then((m) => ({
    default: m.InstallationsListPage,
  })),
)
const InstallationDetailPage = lazy(() =>
  import('@/modules/signage/installation/pages/InstallationDetailPage').then((m) => ({
    default: m.InstallationDetailPage,
  })),
)
const ClientsPage = lazy(() =>
  import('@/modules/signage/clients/pages/ClientsPage').then((m) => ({ default: m.ClientsPage })),
)
const ResalePage = lazy(() =>
  import('@/modules/signage/resale/pages/ResalePage').then((m) => ({ default: m.ResalePage })),
)

function signageShell(permission: Permission, element: ReactNode) {
  return (
    <RequireModuleRoute moduleId="signage">
      <RequirePermission anyOf={[permission]}>{element}</RequirePermission>
    </RequireModuleRoute>
  )
}

export const signageRouteChildren: RouteObject[] = [
  {
    path: 'signage/produtos',
    element: signageShell(PERMISSIONS.CATALOG_READ, <SignageProductsListPage />),
  },
  {
    path: 'signage/produtos/novo',
    element: signageShell(PERMISSIONS.CATALOG_WRITE, <SignageProductCreatePage />),
  },
  {
    path: 'signage/produtos/:productId',
    element: signageShell(PERMISSIONS.CATALOG_READ, <SignageProductDetailPage />),
  },
  {
    path: 'signage/categorias',
    element: signageShell(PERMISSIONS.CATALOG_READ, <SignageCategoriesPage />),
  },
  {
    path: 'signage/orcamentos',
    element: signageShell(PERMISSIONS.QUOTES_READ, <QuotesListPage />),
  },
  {
    path: 'signage/orcamentos/novo',
    element: signageShell(PERMISSIONS.QUOTES_WRITE, <QuoteCreatePage />),
  },
  {
    path: 'signage/orcamentos/:quoteId',
    element: signageShell(PERMISSIONS.QUOTES_READ, <QuoteDetailPage />),
  },
  {
    path: 'signage/producao',
    element: signageShell(PERMISSIONS.PRODUCTION_READ, <ProductionKanbanPage />),
  },
  {
    path: 'signage/instalacoes',
    element: signageShell(PERMISSIONS.INSTALLATION_READ, <InstallationsListPage />),
  },
  {
    path: 'signage/instalacoes/:installationId',
    element: signageShell(PERMISSIONS.INSTALLATION_READ, <InstallationDetailPage />),
  },
  {
    path: 'signage/clientes',
    element: signageShell(PERMISSIONS.DASHBOARD_VIEW, <ClientsPage />),
  },
  {
    path: 'signage/revenda',
    element: signageShell(PERMISSIONS.PARTNERS_READ, <ResalePage />),
  },
]
