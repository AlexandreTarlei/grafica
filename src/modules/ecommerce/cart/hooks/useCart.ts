import { useQuery } from '@tanstack/react-query'
import { getCart } from '@/modules/ecommerce/cart/services/cart.api'

export const cartQueryKey = ['ecommerce', 'cart'] as const

export function useCart() {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: getCart,
  })
}
