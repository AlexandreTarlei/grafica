import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LoadingBlock } from '@/components/feedback/LoadingBlock'
import { CartDrawer } from '@/modules/store/components/CartDrawer'
import { CartDrawerProvider } from '@/modules/store/components/cart-drawer-context'
import { ShopFooter } from '@/modules/store/components/ShopFooter'
import { ShopHeader } from '@/modules/store/components/ShopHeader'
import { WhatsAppFloat } from '@/modules/store/components/WhatsAppFloat'

export function ShopLayout() {
  return (
    <CartDrawerProvider>
      <div className="bg-background flex min-h-svh flex-col">
        <ShopHeader />
        <CartDrawer />
        <main className="flex-1">
          <Suspense fallback={<LoadingBlock className="min-h-[50vh]" />}>
            <Outlet />
          </Suspense>
        </main>
        <ShopFooter />
        <WhatsAppFloat />
      </div>
    </CartDrawerProvider>
  )
}
