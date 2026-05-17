import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type CartDrawerContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  openCart: () => void
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null)

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openCart = useCallback(() => setOpen(true), [])

  const value = useMemo(
    () => ({ open, setOpen, openCart }),
    [open, openCart],
  )

  return <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) {
    throw new Error('useCartDrawer must be used within CartDrawerProvider')
  }
  return ctx
}
