import { Outlet } from 'react-router-dom'
import { env } from '@/core/env'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { cn } from '@/lib/utils'

export function AuthLayout() {
  const { brandName, logoUrl } = useTenantPlatform()
  const displayName = brandName || env.appName
  const letter = displayName.trim().charAt(0).toUpperCase() || 'S'

  return (
    <div className="bg-background flex min-h-svh flex-col md:flex-row">
      <div
        className={cn(
          'from-primary/10 via-muted/30 to-background relative hidden overflow-hidden md:flex md:w-[44%] md:max-w-xl md:flex-col md:justify-between md:border-r md:p-10 lg:p-14',
        )}
      >
        <div className="relative z-10 flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="size-11 object-contain" width={44} height={44} />
          ) : (
            <span className="bg-primary text-primary-foreground shadow-card flex size-11 items-center justify-center rounded-xl text-lg font-bold">
              {letter}
            </span>
          )}
          <div>
            <p className="text-lg font-semibold tracking-tight">{displayName}</p>
            <p className="text-muted-foreground text-sm">Acesso seguro à sua conta</p>
          </div>
        </div>
        <div className="relative z-10 mt-auto space-y-4">
          <h2 className="section-title max-w-xs">Gestão profissional de pedidos e produção</h2>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Entre para acompanhar orçamentos, aprovar artes e gerir a sua conta num só lugar.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
        <div className="mb-8 flex items-center gap-3 md:hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="size-10 object-contain" width={40} height={40} />
          ) : (
            <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg text-sm font-bold">
              {letter}
            </span>
          )}
          <span className="text-base font-semibold tracking-tight">{displayName}</span>
        </div>
        <div className="shadow-card w-full max-w-md rounded-2xl border bg-card p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
