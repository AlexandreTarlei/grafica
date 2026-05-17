import { NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Download,
  FileText,
  LayoutDashboard,
  Package,
  Palette,
  Settings,
  Truck,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/conta', label: 'Resumo', end: true, icon: LayoutDashboard },
  { to: '/conta/pedidos', label: 'Meus pedidos', icon: Package },
  { to: '/conta/producao', label: 'Produção', icon: Truck },
  { to: '/conta/arte', label: 'Aprovação de arte', icon: Palette },
  { to: '/conta/downloads', label: 'Downloads', icon: Download },
  { to: '/conta/faturas', label: 'Faturas', icon: FileText },
  { to: '/conta/perfil', label: 'Perfil', icon: Settings },
  { to: '/conta/notificacoes', label: 'Notificações', icon: Bell },
] as const

export function AccountLayout() {
  return (
    <PageContainer noMotion>
      <PageHeader
        noMotion
        title="Minha conta"
        description="Acompanhe pedidos, arte e documentos."
      />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="shrink-0 lg:w-56">
          <ScrollArea className="w-full lg:hidden">
            <nav className="flex gap-1 pb-2">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={'end' in link ? link.end : false}
                  className={({ isActive }) =>
                    cn(
                      'transition-base flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted',
                    )
                  }
                >
                  <link.icon className="size-4 shrink-0" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
          <nav className="hidden flex-col gap-0.5 lg:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={'end' in link ? link.end : false}
                className={({ isActive }) =>
                  cn(
                    'transition-base flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-card'
                      : 'text-muted-foreground hover:bg-muted',
                  )
                }
              >
                <link.icon className="size-4 shrink-0 opacity-80" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  )
}
