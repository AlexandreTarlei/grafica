import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { useAdminNavItems } from '@/hooks/useAdminNavItems'

export function AdminSidebar() {
  const location = useLocation()
  const items = useAdminNavItems()
  const { brandName, logoUrl } = useTenantPlatform()
  const brandLetter = brandName.trim().charAt(0).toUpperCase() || 'S'

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-sidebar-border border-b">
        <Link
          to="/admin/dashboard"
          className="flex min-w-0 items-center gap-2 px-1 py-0.5"
          title={brandName}
        >
          {logoUrl ? (
            <span className="bg-sidebar-accent flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              <img
                src={logoUrl}
                alt=""
                className="max-h-8 max-w-full object-contain"
                width={32}
                height={32}
              />
            </span>
          ) : (
            <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
              {brandLetter}
            </span>
          )}
          <span className="text-sidebar-foreground truncate text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            {brandName}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.matchExact
                  ? location.pathname === item.path
                  : location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      render={
                        <Link to={item.path}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <p className="text-sidebar-foreground/60 px-2 py-1 text-xs group-data-[collapsible=icon]:hidden">
          Painel administrativo
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
