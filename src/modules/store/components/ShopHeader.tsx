import { Link, useLocation } from 'react-router-dom'
import { MenuIcon, ShoppingCart, User } from 'lucide-react'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { env } from '@/core/env'
import { useAuth } from '@/hooks/useAuth'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { useCart } from '@/modules/ecommerce/cart/hooks/useCart'
import { useCartDrawer } from '@/modules/store/components/cart-drawer-context'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { StoreSearch } from '@/modules/store/components/StoreSearch'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/produtos', label: 'Produtos' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/orcamento', label: 'Orçamento' },
  { to: '/contato', label: 'Contato' },
  { to: '/parceiros', label: 'Parceiros' },
] as const

export function ShopHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { brandName, logoUrl } = useTenantPlatform()
  const { data: cart } = useCart()
  const { setOpen: setCartOpen } = useCartDrawer()
  const cartCount = cart?.linhas?.reduce((s, l) => s + l.quantidade, 0) ?? 0

  const letter = (brandName || env.appName).trim().charAt(0).toUpperCase() || 'G'

  return (
    <header className="border-border/60 bg-background/80 supports-backdrop-filter:backdrop-blur-md sticky top-0 z-40 border-b shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-16 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="size-9 object-contain" width={36} height={36} />
          ) : (
            <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-bold">
              {letter}
            </span>
          )}
          <span className="text-foreground hidden font-semibold tracking-tight sm:inline">
            {brandName || env.appName}
          </span>
        </Link>

        <nav className="text-muted-foreground ml-2 hidden items-center gap-6 text-sm font-medium lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'transition-base rounded-md px-1 py-0.5 hover:text-foreground',
                location.pathname.startsWith(item.to) &&
                  'text-foreground font-medium underline decoration-primary/40 underline-offset-4',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex min-h-11 items-center gap-1 sm:gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <StoreSearch className="relative hidden max-w-xs flex-1 md:flex" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative size-11"
            aria-label="Carrinho"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 ? (
              <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex size-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            ) : null}
          </Button>

          <Link
            to="/carrinho"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          >
            Carrinho
          </Link>

          <Link
            to={isAuthenticated ? '/conta' : '/login'}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'min-h-11 gap-1.5')}
          >
            <User className="size-4" />
            <span className="hidden sm:inline">{isAuthenticated ? 'Minha conta' : 'Entrar'}</span>
          </Link>

          <Link to="/orcamento" className={cn(buttonVariants({ size: 'sm' }), 'hidden min-h-11 sm:inline-flex')}>
            Orçar agora
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" type="button" aria-label="Menu" className="size-11 lg:hidden">
                  <MenuIcon className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[min(100vw-2rem,20rem)]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-2 pb-4">
                <StoreSearch className="w-full md:hidden" onNavigate={() => setOpen(false)} />
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'transition-base min-h-11 rounded-lg px-3 py-2.5 text-sm font-medium',
                      location.pathname.startsWith(item.to)
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setCartOpen(true)
                  }}
                  className="hover:bg-muted min-h-11 rounded-lg px-3 py-2.5 text-left text-sm"
                >
                  Carrinho {cartCount > 0 ? `(${cartCount})` : ''}
                </button>
                <Link
                  to={isAuthenticated ? '/conta' : '/login'}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), 'min-h-11 justify-center')}
                >
                  {isAuthenticated ? 'Minha conta' : 'Entrar'}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
