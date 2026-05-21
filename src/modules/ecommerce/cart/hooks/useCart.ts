import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { getCart } from '@/modules/ecommerce/cart/services/cart.api'
import { EMPTY_CART } from '@/modules/ecommerce/cart/types'

export const cartQueryKey = ['ecommerce', 'cart'] as const

export function useCart() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: cartQueryKey,
    queryFn: getCart,
    enabled: isAuthenticated,
    placeholderData: () => EMPTY_CART,
  })
}
