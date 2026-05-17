import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCartItem, removeCartLine, updateCartLine } from '@/modules/ecommerce/cart/services/cart.api'
import { cartQueryKey } from '@/modules/ecommerce/cart/hooks/useCart'

export function useCartMutations() {
  const qc = useQueryClient()

  const invalidate = () => qc.invalidateQueries({ queryKey: cartQueryKey })

  const addItem = useMutation({
    mutationFn: addCartItem,
    onSuccess: () => void invalidate(),
  })

  const updateQty = useMutation({
    mutationFn: ({ lineId, quantidade }: { lineId: string; quantidade: number }) =>
      updateCartLine(lineId, quantidade),
    onSuccess: () => void invalidate(),
  })

  const removeLine = useMutation({
    mutationFn: removeCartLine,
    onSuccess: () => void invalidate(),
  })

  return { addItem, updateQty, removeLine }
}
