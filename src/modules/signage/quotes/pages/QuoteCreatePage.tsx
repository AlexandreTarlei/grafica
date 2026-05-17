import { useMemo } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  CurrencyInput,
  FormActions,
  FormField,
  FormSection,
  RhfSelect,
} from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import {
  SIGNAGE_CATEGORY_LABELS,
  SIGNAGE_PRODUCT_CATEGORIES,
} from '@/modules/signage/products/types'
import { createQuote } from '@/modules/signage/quotes/services/quotes.api'
import {
  quoteCreateFormSchema,
  type QuoteCreateFormInput,
} from '@/modules/signage/quotes/schemas/quote.schema'
import { ArtworkPreview } from '@/modules/signage/shared/components/ArtworkPreview'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { formatCurrency } from '@/modules/signage/shared/utils/format'
import { calculateLineSubtotal, calculateQuoteTotals } from '@/modules/signage/shared/utils/pricing'

const defaultLine = (): QuoteCreateFormInput['lines'][number] => ({
  productName: '',
  category: 'banner',
  widthCm: 100,
  heightCm: 50,
  quantity: 1,
  unitPrice: 0,
})

export function QuoteCreatePage() {
  const companyId = useCurrentCompanyId()
  const navigate = useNavigate()

  const form = useForm<QuoteCreateFormInput>({
    resolver: zodResolver(quoteCreateFormSchema),
    defaultValues: { clientName: '', lines: [defaultLine()] },
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines' })
  const lines = useWatch({ control: form.control, name: 'lines' }) ?? []

  const totals = useMemo(
    () =>
      calculateQuoteTotals(
        lines.map((l) => ({
          category: l.category,
          widthCm: l.widthCm,
          heightCm: l.heightCm,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      ),
    [lines],
  )

  const mutation = useMutation({
    mutationFn: (values: QuoteCreateFormInput) =>
      createQuote(companyId as number, {
        clientName: values.clientName,
        lines: values.lines,
      }),
    onSuccess: (q) => {
      toast.success('Orçamento criado')
      navigate(`/admin/signage/orcamentos/${q.id}`)
    },
    onError: () => toast.error('Erro ao criar orçamento'),
  })

  return (
    <PageShell title="Novo orçamento" subtitle="Cálculo em tempo real por item.">
      <form
        className="grid gap-8 lg:grid-cols-3"
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        noValidate
      >
        <div className="flex flex-col gap-6 lg:col-span-2">
          <FormSection title="Cliente">
            <FormField control={form.control} name="clientName" label="Nome do cliente">
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

          {fields.map((field, idx) => {
            const line = lines[idx]
            const subtotal = line
              ? calculateLineSubtotal({
                  category: line.category,
                  widthCm: line.widthCm,
                  heightCm: line.heightCm,
                  quantity: line.quantity,
                  unitPrice: line.unitPrice,
                })
              : 0

            return (
              <FormSection key={field.id} title={`Item ${idx + 1}`}>
                <FormField control={form.control} name={`lines.${idx}.productName`} label="Descrição">
                  {(f) => (
                    <Input
                      id={f.id}
                      placeholder="Descrição do item"
                      aria-invalid={f['aria-invalid']}
                      value={String(f.value ?? '')}
                      onChange={f.onChange}
                      onBlur={f.onBlur}
                      name={f.name}
                      ref={f.ref}
                    />
                  )}
                </FormField>
                <RhfSelect
                  control={form.control}
                  name={`lines.${idx}.category`}
                  label="Categoria"
                  options={SIGNAGE_PRODUCT_CATEGORIES.map((c) => ({
                    value: c,
                    label: SIGNAGE_CATEGORY_LABELS[c],
                  }))}
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <FormField control={form.control} name={`lines.${idx}.widthCm`} label="Largura (cm)">
                    {(f) => (
                      <Input
                        type="number"
                        min={1}
                        id={f.id}
                        value={Number(f.value) || ''}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                        onBlur={f.onBlur}
                        name={f.name}
                        ref={f.ref}
                      />
                    )}
                  </FormField>
                  <FormField control={form.control} name={`lines.${idx}.heightCm`} label="Altura (cm)">
                    {(f) => (
                      <Input
                        type="number"
                        min={1}
                        id={f.id}
                        value={Number(f.value) || ''}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                        onBlur={f.onBlur}
                        name={f.name}
                        ref={f.ref}
                      />
                    )}
                  </FormField>
                  <FormField control={form.control} name={`lines.${idx}.quantity`} label="Qtd">
                    {(f) => (
                      <Input
                        type="number"
                        min={1}
                        id={f.id}
                        value={Number(f.value) || ''}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                        onBlur={f.onBlur}
                        name={f.name}
                        ref={f.ref}
                      />
                    )}
                  </FormField>
                  <FormField control={form.control} name={`lines.${idx}.unitPrice`} label="Preço un.">
                    {(f) => (
                      <CurrencyInput
                        id={f.id}
                        value={Number(f.value) || 0}
                        onChange={f.onChange}
                        onBlur={f.onBlur}
                        name={f.name}
                        ref={f.ref}
                      />
                    )}
                  </FormField>
                </div>
                <p className="text-sm font-medium">Subtotal: {formatCurrency(subtotal)}</p>
                {line ? (
                  <ArtworkPreview
                    widthCm={line.widthCm}
                    heightCm={line.heightCm}
                    imageUrl={line.artworkUrl}
                  />
                ) : null}
                {fields.length > 1 ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(idx)}>
                    Remover item
                  </Button>
                ) : null}
              </FormSection>
            )
          })}

          <Button type="button" variant="outline" onClick={() => append(defaultLine())}>
            Adicionar item
          </Button>
          <FormActions submitLabel="Guardar orçamento" loading={mutation.isPending} />
        </div>

        <aside className="bg-card border-border shadow-card sticky top-4 space-y-2 rounded-xl border p-6 ring-1 ring-border/60">
          <h3 className="font-semibold">Resumo</h3>
          <p className="text-muted-foreground text-sm">{fields.length} item(ns)</p>
          <p className="text-sm">Subtotal: {formatCurrency(totals.subtotal)}</p>
          <p className="text-sm">Desconto: {formatCurrency(totals.discount)}</p>
          <p className="text-lg font-semibold">Total: {formatCurrency(totals.total)}</p>
        </aside>
      </form>
    </PageShell>
  )
}
