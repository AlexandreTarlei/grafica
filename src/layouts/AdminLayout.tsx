import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LoadingBlock } from '@/components/feedback/LoadingBlock'
import { AdminNavbar } from '@/components/layout/AdminNavbar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const location = useLocation()
  const isWideDashboard =
    location.pathname === '/admin/dashboard' || location.pathname.startsWith('/admin/financeiro')

  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar />
      <SidebarInset>
        <AdminNavbar />
        <div className="flex-1 p-4 md:p-6">
          <div className={cn('mx-auto w-full', isWideDashboard ? 'max-w-[1440px]' : 'max-w-6xl')}>
            <Suspense fallback={<LoadingBlock />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
