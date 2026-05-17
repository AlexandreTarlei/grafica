/**
 * Fachada de pagamento no browser — intents geridos pelo backend.
 * Configure VITE_BILLING_PROVIDER=asaas para fluxo real (quando o backend expuser o endpoint).
 */
import { http } from '@/services/http/client'

export type PaymentIntentResult = {
  clientSecret: string | null
  provider: 'stub' | 'stripe' | 'mercadopago' | 'asaas'
}

export type PaymentGateway = {
  createPaymentIntent: (params: { amount: number; currency: string }) => Promise<PaymentIntentResult>
  confirmPayment: (params: { clientSecret: string | null; orderId: string }) => Promise<{ ok: boolean }>
}

const provider = (import.meta.env.VITE_BILLING_PROVIDER ?? 'stub') as PaymentIntentResult['provider']

export const stubPaymentGateway: PaymentGateway = {
  async createPaymentIntent() {
    return { clientSecret: 'stub_secret_dev', provider: 'stub' }
  },
  async confirmPayment() {
    return { ok: true }
  },
}

async function createAsaasIntent(params: {
  amount: number
  currency: string
}): Promise<PaymentIntentResult> {
  const { data } = await http.post<{ client_secret?: string | null }>('/billing/payment-intent', {
    amount: params.amount,
    currency: params.currency,
    provider: 'asaas',
  })
  return { clientSecret: data.client_secret ?? null, provider: 'asaas' }
}

async function confirmAsaasPayment(params: {
  clientSecret: string | null
  orderId: string
}): Promise<{ ok: boolean }> {
  const { data } = await http.post<{ ok: boolean }>('/billing/confirm-payment', {
    client_secret: params.clientSecret,
    order_draft_id: params.orderId,
  })
  return { ok: Boolean(data.ok) }
}

export const paymentGateway: PaymentGateway =
  provider === 'asaas'
    ? {
        createPaymentIntent: createAsaasIntent,
        confirmPayment: confirmAsaasPayment,
      }
    : stubPaymentGateway
