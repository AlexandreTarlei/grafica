/* eslint-disable react-refresh/only-export-components -- manifesto de rotas */
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireModuleRoute } from '@/core/permissions/RequireModuleRoute'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ShopLayout } from '@/modules/store/layout/ShopLayout'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { adminRouteChildren } from '@/routes/admin.routes'
import { signupRouteChild } from '@/routes/commercial.routes'
import { RequireAuth } from '@/routes/RequireAuth'
import { RootLayout } from '@/routes/RootLayout'
import { storeAccountRouteChildren, storePublicRouteChildren } from '@/routes/store.routes'

const CartPage = lazy(() =>
  import('@/modules/ecommerce/cart/pages/CartPage').then((m) => ({ default: m.CartPage })),
)
const CheckoutPage = lazy(() =>
  import('@/modules/ecommerce/checkout/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
)
const CheckoutConfirmationPage = lazy(() =>
  import('@/modules/ecommerce/checkout/pages/CheckoutConfirmationPage').then((m) => ({
    default: m.CheckoutConfirmationPage,
  })),
)

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ShopLayout />,
        children: [
          ...storePublicRouteChildren,
          {
            element: (
              <RequireModuleRoute moduleId="ecommerce" redirectTo="/login">
                <RequireAuth />
              </RequireModuleRoute>
            ),
            children: [
              { path: 'carrinho', element: <CartPage /> },
              { path: 'checkout/confirmacao/:orderId', element: <CheckoutConfirmationPage /> },
              { path: 'checkout', element: <CheckoutPage /> },
            ],
          },
          {
            element: <RequireAuth />,
            children: storeAccountRouteChildren,
          },
        ],
      },
      {
        path: 'cadastro',
        element: <AuthLayout />,
        children: [signupRouteChild],
      },
      {
        path: 'login',
        element: <AuthLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: adminRouteChildren,
          },
          { path: 'dashboard', element: <Navigate to="/conta" replace /> },
          { path: 'planos', element: <Navigate to="/orcamento" replace /> },
          { path: 'onboarding', element: <Navigate to="/conta" replace /> },
          { path: 'conta/faturacao', element: <Navigate to="/conta/faturas" replace /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
