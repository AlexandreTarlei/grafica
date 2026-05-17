import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingBlock } from '@/components/feedback/LoadingBlock'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  FormField,
  FormSection,
  FormWizard,
  MaskedInput,
  RhfSelect,
  UploadField,
  useFormWizard,
} from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { clearCartAfterCheckout } from '@/modules/ecommerce/cart/services/cart.api'
import { cartQueryKey } from '@/modules/ecommerce/cart/hooks/useCart'
import { useCart } from '@/modules/ecommerce/cart/hooks/useCart'
import { CartSummary } from '@/modules/ecommerce/cart/components/CartSummary'
import { CheckoutSteps } from '@/modules/store/components/CheckoutSteps'
import { checkoutSchema, type CheckoutFormValues } from '@/modules/ecommerce/checkout/schemas/checkout.schema'
import { postCheckoutConfirm, postCheckoutSession } from '@/modules/ecommerce/checkout/services/checkout.api'

const STEPS = ['Cliente', 'Morada', 'Frete', 'Pagamento', 'Revisão'] as const

const STEP_FIELDS: (readonly (keyof CheckoutFormValues)[])[] = [
  ['nome', 'email', 'telefone'],
  ['morada', 'cidade', 'codigoPostal', 'pais'],
  ['metodoEnvio'],
  ['metodoPagamento'],
  [],
]

const SHIPPING_LABELS: Record<string, string> = {
  standard: 'Envio standard (3–5 dias úteis)',
  express: 'Envio expresso (24–48 h)',
  levantamento: 'Levantamento na loja',
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: cart, isLoading: cartLoading } = useCart()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      morada: '',
      cidade: '',
      codigoPostal: '',
      pais: 'Portugal',
      metodoEnvio: 'standard',
      metodoPagamento: 'cartao',
    },
    mode: 'onBlur',
  })
  const watched = useWatch({ control: form.control })

  const wizard = useFormWizard(form, STEPS, STEP_FIELDS)

  const finalize = () =>
    void form.handleSubmit(async (values) => {
      if (!cart || cart.linhas.length === 0) return
      setSubmitting(true)
      try {
        const session = await postCheckoutSession(values)
        const amount = cart.total
        const { orderId } = await postCheckoutConfirm({
          orderDraftId: session.orderDraftId,
          amount,
          currency: 'EUR',
        })
        await clearCartAfterCheckout()
        await qc.invalidateQueries({ queryKey: cartQueryKey })
        navigate(`/checkout/confirmacao/${orderId}`)
      } finally {
        setSubmitting(false)
      }
    })()

  if (cartLoading) {
    return (
      <PageContainer>
        <LoadingBlock />
      </PageContainer>
    )
  }

  if (!cart || cart.linhas.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          title="Carrinho vazio"
          description="Adicione artigos antes do checkout."
          action={{ label: 'Ir ao carrinho', to: '/carrinho' }}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <PageHeader
            noMotion
            title="Checkout"
            description={`Passo ${wizard.step + 1} de ${STEPS.length}: ${wizard.label}`}
          />

          <CheckoutSteps steps={STEPS} currentStep={wizard.step} />

          <form className="grid gap-6" onSubmit={(e) => e.preventDefault()} noValidate>
            <FormWizard
              steps={STEPS}
              currentStep={wizard.step}
              onPrev={wizard.prev}
              onNext={wizard.isLast ? undefined : () => void wizard.next()}
              footer={
                wizard.isLast ? (
                  <Button type="button" disabled={submitting} className="gap-2" onClick={finalize}>
                    {submitting ? (
                      <>
                        <Loader2Icon className="size-4 animate-spin" />
                        A finalizar…
                      </>
                    ) : (
                      'Confirmar encomenda'
                    )}
                  </Button>
                ) : null
              }
            >
              {wizard.step === 0 ? (
                <FormSection title="Dados do cliente">
                  <FormField control={form.control} name="nome" label="Nome completo">
                    {(field) => (
                      <Input
                        id={field.id}
                        aria-invalid={field['aria-invalid']}
                        value={String(field.value ?? '')}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  </FormField>
                  <FormField control={form.control} name="email" label="E-mail">
                    {(field) => (
                      <Input
                        id={field.id}
                        type="email"
                        aria-invalid={field['aria-invalid']}
                        value={String(field.value ?? '')}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  </FormField>
                  <FormField control={form.control} name="telefone" label="Telefone">
                    {(field) => (
                      <MaskedInput
                        mask="phone"
                        id={field.id}
                        aria-invalid={field['aria-invalid']}
                        value={String(field.value ?? '')}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  </FormField>
                </FormSection>
              ) : null}

              {wizard.step === 1 ? (
                <FormSection title="Morada de entrega">
                  <FormField control={form.control} name="morada" label="Morada">
                    {(field) => (
                      <Input
                        id={field.id}
                        aria-invalid={field['aria-invalid']}
                        value={String(field.value ?? '')}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  </FormField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="cidade" label="Cidade">
                      {(field) => (
                        <Input
                          id={field.id}
                          aria-invalid={field['aria-invalid']}
                          value={String(field.value ?? '')}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      )}
                    </FormField>
                    <FormField control={form.control} name="codigoPostal" label="Código postal">
                      {(field) => (
                        <MaskedInput
                          mask="postalCodePt"
                          id={field.id}
                          aria-invalid={field['aria-invalid']}
                          value={String(field.value ?? '')}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      )}
                    </FormField>
                  </div>
                  <FormField control={form.control} name="pais" label="País">
                    {(field) => (
                      <Input
                        id={field.id}
                        aria-invalid={field['aria-invalid']}
                        value={String(field.value ?? '')}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  </FormField>
                </FormSection>
              ) : null}

              {wizard.step === 2 ? (
                <FormSection title="Envio">
                  <RhfSelect
                    control={form.control}
                    name="metodoEnvio"
                    label="Método de envio"
                    triggerClassName="max-w-md"
                    options={[
                      { value: 'standard', label: 'Standard (3–5 dias úteis)' },
                      { value: 'express', label: 'Expresso (24–48 h)' },
                      { value: 'levantamento', label: 'Levantamento na loja' },
                    ]}
                  />
                </FormSection>
              ) : null}

              {wizard.step === 3 ? (
                <FormSection title="Pagamento">
                  <RhfSelect
                    control={form.control}
                    name="metodoPagamento"
                    label="Método de pagamento"
                    triggerClassName="max-w-md"
                    options={[
                      { value: 'cartao', label: 'Cartão (stub)' },
                      { value: 'mbway', label: 'MB Way (stub)' },
                      { value: 'referencia', label: 'Referência multibanco (stub)' },
                    ]}
                  />
                  <p className="text-muted-foreground text-xs">
                    Integração real via backend + SDK público; aqui apenas simulação segura.
                  </p>
                </FormSection>
              ) : null}

              {wizard.step === 4 ? (
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Revisão</CardTitle>
                      <CardDescription>Confirme os dados antes de finalizar.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Nome:</span> {watched?.nome ?? ''}
                      </p>
                      <p>
                        <span className="text-muted-foreground">E-mail:</span> {watched?.email ?? ''}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Morada:</span> {watched?.morada ?? ''},{' '}
                        {watched?.codigoPostal ?? ''} {watched?.cidade ?? ''}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Envio:</span>{' '}
                        {SHIPPING_LABELS[watched?.metodoEnvio ?? 'standard'] ?? watched?.metodoEnvio}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Pagamento:</span>{' '}
                        {watched?.metodoPagamento ?? ''}
                      </p>
                    </CardContent>
                  </Card>
                  <FormSection title="Upload final de arte (opcional)">
                    <UploadField multiple />
                  </FormSection>
                </div>
              ) : null}
            </FormWizard>
          </form>
        </div>

        <CartSummary cart={cart} />
      </div>
    </PageContainer>
  )
}
