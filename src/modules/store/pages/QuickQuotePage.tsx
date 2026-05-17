import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import {
  FormActions,
  FormField,
  FormSection,
  MaskedInput,
  RhfSelect,
  RhfTextarea,
} from '@/components/forms'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Seo } from '@/modules/commercial/seo/Seo'
import {
  FileDropzone,
  type DroppedFile,
} from '@/modules/signage/shared/components/FileDropzone'
import { STORE_CATEGORIES } from '@/modules/store/content/ecommerce-content'
import {
  quickQuoteFormSchema,
  type QuickQuoteFormInput,
} from '@/modules/store/schemas/quickQuote.schema'
import { submitQuickQuoteRequest } from '@/modules/store/services/quick-quote.api'
import { uploadArtFile } from '@/modules/store/services/uploads.api'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function QuickQuotePage() {
  const [sent, setSent] = useState(false)
  const [artFiles, setArtFiles] = useState<DroppedFile[]>([])
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<QuickQuoteFormInput>({
    resolver: zodResolver(quickQuoteFormSchema),
    defaultValues: {
      nome: '',
      email: '',
      tel: '',
      cat: '',
      width: 100,
      height: 100,
      qty: 1,
      notes: '',
    },
    mode: 'onBlur',
  })

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6">
        <h1 className="text-2xl font-semibold">Obrigado!</h1>
        <p className="text-muted-foreground mt-2">Recebemos o seu pedido de orçamento.</p>
        <Link to="/produtos" className={cn(buttonVariants(), 'mt-6 inline-flex')}>
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <Seo title="Orçamento rápido" description="Peça um orçamento personalizado." canonicalPath="/orcamento" />
      <h1 className="text-3xl font-bold tracking-tight">Orçamento rápido</h1>
      <p className="text-muted-foreground mt-2 mb-8">
        Indique medidas, quantidade e anexe a sua arte. Respondemos em poucas horas úteis.
      </p>

      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitting(true)
          try {
            const artworkAssetIds: number[] = []
            for (const f of artFiles) {
              const asset = await uploadArtFile(f.file, 'quote_request')
              artworkAssetIds.push(asset.id)
            }
            await submitQuickQuoteRequest({ ...values, artworkAssetIds })
            setSent(true)
            toast.success('Pedido de orçamento enviado! Entraremos em contacto em breve.')
          } catch {
            toast.error('Não foi possível enviar o pedido. Tente novamente.')
          } finally {
            setSubmitting(false)
          }
        })}
        noValidate
      >
        <FormSection title="Contacto">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="nome" label="Nome">
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
          </div>
          <FormField control={form.control} name="tel" label="Telefone">
            {(field) => (
              <MaskedInput
                mask="phone"
                id={field.id}
                value={String(field.value ?? '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          </FormField>
        </FormSection>

        <FormSection title="Projeto">
          <RhfSelect
            control={form.control}
            name="cat"
            label="Tipo de produto"
            options={STORE_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
          />
          <div className="grid grid-cols-3 gap-3">
            <FormField control={form.control} name="width" label="Largura (cm)">
              {(field) => (
                <Input
                  type="number"
                  min={1}
                  id={field.id}
                  value={Number(field.value) || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
            <FormField control={form.control} name="height" label="Altura (cm)">
              {(field) => (
                <Input
                  type="number"
                  min={1}
                  id={field.id}
                  value={Number(field.value) || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
            <FormField control={form.control} name="qty" label="Qtd">
              {(field) => (
                <Input
                  type="number"
                  min={1}
                  id={field.id}
                  value={Number(field.value) || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
          </div>
          <RhfTextarea
            control={form.control}
            name="notes"
            label="Detalhes do projeto"
            placeholder="Acabamentos, prazo, local de instalação…"
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Arte / ficheiros</p>
            <FileDropzone accept="images-pdf" value={artFiles} onChange={setArtFiles} />
          </div>
        </FormSection>

        <FormActions
          submitLabel="Enviar pedido de orçamento"
          className="border-0 pt-0"
          loading={submitting}
        />
      </form>
    </div>
  )
}
