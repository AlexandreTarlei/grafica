import { isAxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { addCartItem, removeCartLine, updateCartLine } from '@/modules/ecommerce/cart/services/cart.api'
import { cartQueryKey } from '@/modules/ecommerce/cart/hooks/useCart'

function useCartAuthRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  return (error: unknown) => {
    if (!isAuthenticated || (isAxiosError(error) && error.response?.status === 401)) {
      navigate('/login', { replace: false, state: { from: location } })
    }
  }
}

export function useCartMutations() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const redirectToLogin = useCartAuthRedirect()

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate('/login', { replace: false, state: { from: location } })
      throw new Error('login_required')
    }
  }

  const invalidate = () => qc.invalidateQueries({ queryKey: cartQueryKey })

  const addItem = useMutation({
    mutationFn: async (input: Parameters<typeof addCartItem>[0]) => {
      requireAuth()
      return addCartItem(input)
    },
    onSuccess: () => void invalidate(),
    onError: redirectToLogin,
  })

  const updateQty = useMutation({
    mutationFn: async ({ lineId, quantidade }: { lineId: string; quantidade: number }) => {
      requireAuth()
      return updateCartLine(lineId, quantidade)
    },
    onSuccess: () => void invalidate(),
    onError: redirectToLogin,
  })

  const removeLine = useMutation({
    mutationFn: async (lineId: string) => {
      requireAuth()
      return removeCartLine(lineId)
    },
    onSuccess: () => void invalidate(),
    onError: redirectToLogin,
  })

  return { addItem, updateQty, removeLine }
}
