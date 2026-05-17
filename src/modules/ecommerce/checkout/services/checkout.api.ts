/**
 * Contrato esperado (FastAPI):
 * - POST /checkout/session   { ...dados checkout }
 * - POST /checkout/confirm   { client_secret?, order_draft_id? }
 */
import { http } from '@/services/http/client'
import type { CheckoutFormValues } from '@/modules/ecommerce/checkout/schemas/checkout.schema'
import { paymentGateway } from '@/modules/ecommerce/checkout/services/paymentGateway'

const USE_MOCK = import.meta.env.VITE_USE_CHECKOUT_MOCK !== 'false'

export type CheckoutSessionResponse = {
  orderDraftId: string
  amount: number
  currency: string
}

export async function postCheckoutSession(
  body: CheckoutFormValues,
): Promise<CheckoutSessionResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    return { orderDraftId: `draft-${Date.now()}`, amount: 0, currency: 'EUR' }
  }
  const { data } = await http.post<CheckoutSessionResponse>('/checkout/session', body)
  return data
}

export async function postCheckoutConfirm(input: {
  orderDraftId: string
  amount: number
  currency: string
}): Promise<{ orderId: string }> {
  const intent = await paymentGateway.createPaymentIntent({
    amount: input.amount,
    currency: input.currency,
  })
  await paymentGateway.confirmPayment({
    clientSecret: intent.clientSecret,
    orderId: input.orderDraftId,
  })
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return { orderId: `ORD-${Date.now()}` }
  }
  const { data } = await http.post<{ orderId: string }>('/checkout/confirm', {
    order_draft_id: input.orderDraftId,
    client_secret: intent.clientSecret,
  })
  return data
}
