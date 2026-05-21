import { Link, useLocation } from 'react-router-dom'
import { ExternalLink, LogOut, Moon, Sun } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getAdminBreadcrumbCurrent } from '@/config/page-titles'
import type { ThemeMode } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { NotificationCenter } from '@/realtime/NotificationCenter'
import { env } from '@/core/env'

const themeSequence: ThemeMode[] = ['light', 'dark', 'system']

export function AdminNavbar() {
  const location = useLocation()
  const breadcrumbCurrent = getAdminBreadcrumbCurrent(location.pathname)
  const { user, logout } = useAuth()
  const { tenant, setTenant } = useTenant()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycleTheme = () => {
    const idx = themeSequence.indexOf(theme)
    setTheme(themeSequence[(idx + 1) % themeSequence.length])
  }

  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun

  const initials = (user?.name ?? user?.email ?? '?')
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header
      className={cn(
        'border-border bg-background/90 supports-[backdrop-filter]:bg-background/70',
        'flex h-14 shrink-0 items-center gap-3 border-b px-3 backdrop-blur md:px-4',
      )}
    >
      <SidebarTrigger />

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm">
          <li className="shrink-0">
            <Link to="/admin/dashboard" className="hover:text-foreground font-medium transition-colors">
              Admin
            </Link>
          </li>
          <li aria-hidden className="shrink-0 opacity-50">
            /
          </li>
          <li className="text-foreground min-w-0 truncate font-medium">{breadcrumbCurrent}</li>
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        {import.meta.env.DEV ? (
          <div className="hidden items-center gap-2 lg:flex">
            <Input
              key={tenant?.id ?? 'none'}
              placeholder="Tenant ID"
              defaultValue={tenant?.id ?? ''}
              onBlur={(e) => {
                const id = e.currentTarget.value.trim()
                if (!id) {
                  setTenant(null)
                  return
                }
                setTenant({ id, name: id })
              }}
              className="h-8 w-[7.5rem] lg:w-36"
              aria-label="Identificador da empresa (dev)"
            />
            {tenant?.id ? (
              <Badge variant="secondary" className="max-w-[6rem] truncate">
                {tenant.id}
              </Badge>
            ) : null}
          </div>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex"
          render={<Link to="/" />}
          nativeButton={false}
        >
          <ExternalLink className="size-4" />
          Ver loja
        </Button>

        {env.realtimeEnabled ? <NotificationCenter /> : null}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={cycleTheme}
          title={`Tema: ${theme}`}
          aria-label="Alternar tema"
        >
          <ThemeIcon className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            aria-label="Menu da conta"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar size="sm">
              <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="truncate text-sm font-medium">{user?.name ?? 'Conta'}</span>
                <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
