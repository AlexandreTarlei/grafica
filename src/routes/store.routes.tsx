/* eslint-disable react-refresh/only-export-components -- manifesto rotas loja */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { AccountLayout } from '@/modules/store/account/AccountLayout'

const StoreHomePage = lazy(() =>
  import('@/modules/store/pages/StoreHomePage').then((m) => ({ default: m.StoreHomePage })),
)
const CatalogPage = lazy(() =>
  import('@/modules/store/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })),
)
const ProductDetailPage = lazy(() =>
  import('@/modules/store/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
)
const CategoriesPage = lazy(() =>
  import('@/modules/store/pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
)
const QuickQuotePage = lazy(() =>
  import('@/modules/store/pages/QuickQuotePage').then((m) => ({ default: m.QuickQuotePage })),
)
const ContactPage = lazy(() =>
  import('@/modules/store/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const PartnersPage = lazy(() =>
  import('@/modules/store/pages/PartnersPage').then((m) => ({ default: m.PartnersPage })),
)

const AccountHomePage = lazy(() =>
  import('@/modules/store/account/AccountHomePage').then((m) => ({ default: m.AccountHomePage })),
)
const AccountOrdersPage = lazy(() =>
  import('@/modules/store/account/AccountOrdersPage').then((m) => ({ default: m.AccountOrdersPage })),
)
const AccountOrderDetailPage = lazy(() =>
  import('@/modules/store/account/AccountOrderDetailPage').then((m) => ({
    default: m.AccountOrderDetailPage,
  })),
)
const AccountProductionPage = lazy(() =>
  import('@/modules/store/account/AccountProductionPage').then((m) => ({ default: m.AccountProductionPage })),
)
const AccountArtworkPage = lazy(() =>
  import('@/modules/store/account/AccountArtworkPage').then((m) => ({ default: m.AccountArtworkPage })),
)
const AccountDownloadsPage = lazy(() =>
  import('@/modules/store/account/AccountDownloadsPage').then((m) => ({ default: m.AccountDownloadsPage })),
)
const AccountInvoicesPage = lazy(() =>
  import('@/modules/store/account/AccountInvoicesPage').then((m) => ({ default: m.AccountInvoicesPage })),
)
const AccountProfilePage = lazy(() =>
  import('@/modules/store/account/AccountProfilePage').then((m) => ({ default: m.AccountProfilePage })),
)
const AccountNotificationsPage = lazy(() =>
  import('@/modules/store/account/AccountNotificationsPage').then((m) => ({
    default: m.AccountNotificationsPage,
  })),
)

export const storePublicRouteChildren: RouteObject[] = [
  { index: true, element: <StoreHomePage /> },
  { path: 'produtos', element: <CatalogPage /> },
  { path: 'produtos/:productId', element: <ProductDetailPage /> },
  { path: 'categorias', element: <CategoriesPage /> },
  { path: 'orcamento', element: <QuickQuotePage /> },
  { path: 'contato', element: <ContactPage /> },
  { path: 'parceiros', element: <PartnersPage /> },
]

export const storeAccountRouteChildren: RouteObject[] = [
  {
    path: 'conta',
    element: <AccountLayout />,
    children: [
      { index: true, element: <AccountHomePage /> },
      { path: 'pedidos', element: <AccountOrdersPage /> },
      { path: 'pedidos/:orderId', element: <AccountOrderDetailPage /> },
      { path: 'producao', element: <AccountProductionPage /> },
      { path: 'arte', element: <AccountArtworkPage /> },
      { path: 'downloads', element: <AccountDownloadsPage /> },
      { path: 'faturas', element: <AccountInvoicesPage /> },
      { path: 'perfil', element: <AccountProfilePage /> },
      { path: 'notificacoes', element: <AccountNotificationsPage /> },
    ],
  },
]
