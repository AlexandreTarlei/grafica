import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import {
  CurrencyInput,
  FormActions,
  FormField,
  FormSection,
  RhfCheckbox,
  RhfFileUpload,
  RhfSelect,
} from '@/components/forms'
import { ArtworkPreview } from '@/modules/signage/shared/components/ArtworkPreview'
import {
  SIGNAGE_CATEGORY_LABELS,
  SIGNAGE_PRODUCT_CATEGORIES,
  type SignageProductFormValues,
  type SignageProductMetadata,
} from '@/modules/signage/products/types'
import {
  signageProductFormSchema,
  type SignageProductFormInput,
} from '@/modules/signage/products/schemas/product.schema'

type ProductFormProps = {
  initial: SignageProductFormValues
  onSubmit: (values: SignageProductFormValues) => void
  submitting?: boolean
  submitLabel?: string
}

function toFormInput(initial: SignageProductFormValues): SignageProductFormInput {
  return {
    ...initial,
    metadata: {
      ...initial.metadata,
      materialsText: initial.metadata.materials.join(', '),
      finishesText: initial.metadata.finishes.join(', '),
    },
  }
}

function toApiValues(input: SignageProductFormInput): SignageProductFormValues {
  const { materialsText, finishesText, ...metaRest } = input.metadata
  const metadata: SignageProductMetadata = {
    ...metaRest,
    materials: (materialsText ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    finishes: (finishesText ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }
  return {
    name: input.name,
    sku: input.sku,
    salePrice: input.salePrice,
    active: input.active,
    categoryId: input.categoryId,
    metadata,
  }
}

export function ProductForm({ initial, onSubmit, submitting, submitLabel = 'Guardar' }: ProductFormProps) {
  const form = useForm<SignageProductFormInput>({
    resolver: zodResolver(signageProductFormSchema),
    defaultValues: toFormInput(initial),
    mode: 'onBlur',
  })

  const meta = form.watch('metadata')

  return (
    <form
      className="grid gap-6 lg:grid-cols-2"
      onSubmit={form.handleSubmit((v) => onSubmit(toApiValues(v)))}
      noValidate
    >
      <div className="flex flex-col gap-6">
        <FormSection title="Identidade" description="Nome, SKU e estado do produto.">
          <FormField control={form.control} name="name" label="Nome">
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
            <FormField control={form.control} name="sku" label="SKU">
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
            <FormField control={form.control} name="salePrice" label="Preço base (R$)">
              {(field) => (
                <CurrencyInput
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  value={Number(field.value) || 0}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
          </div>
          <RhfCheckbox control={form.control} name="active" label="Produto ativo" />
        </FormSection>

        <FormSection title="Categoria e dimensões">
          <RhfSelect
            control={form.control}
            name="metadata.category"
            label="Categoria signage"
            options={SIGNAGE_PRODUCT_CATEGORIES.map((c) => ({
              value: c,
              label: SIGNAGE_CATEGORY_LABELS[c],
            }))}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField control={form.control} name="metadata.widthCm" label="Largura (cm)">
              {(field) => (
                <Input
                  type="number"
                  min={1}
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  value={Number(field.value) || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
            <FormField control={form.control} name="metadata.heightCm" label="Altura (cm)">
              {(field) => (
                <Input
                  type="number"
                  min={1}
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  value={Number(field.value) || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
            <FormField control={form.control} name="metadata.depthCm" label="Profundidade (cm)">
              {(field) => (
                <Input
                  type="number"
                  min={0}
                  id={field.id}
                  value={field.value != null ? Number(field.value) : ''}
                  onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
          </div>
          <FormField control={form.control} name="metadata.materialsText" label="Materiais (vírgula)">
            {(field) => (
              <Input
                id={field.id}
                value={String(field.value ?? '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          </FormField>
          <FormField control={form.control} name="metadata.finishesText" label="Acabamentos (vírgula)">
            {(field) => (
              <Input
                id={field.id}
                value={String(field.value ?? '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          </FormField>
          <RhfCheckbox
            control={form.control}
            name="metadata.dynamicPricing"
            label="Preço dinâmico por área"
          />
        </FormSection>

        <FormSection title="Arte">
          <RhfFileUpload
            control={form.control}
            name="metadata.artworkUrl"
            label="Upload de arte"
            multiple={false}
            mapValue={(files) => {
              const url = files[0]?.previewUrl
              return url && url !== 'pdf' ? url : undefined
            }}
          />
        </FormSection>

        <FormActions submitLabel={submitLabel} loading={submitting} />
      </div>
      <ArtworkPreview
        imageUrl={meta?.artworkUrl}
        widthCm={meta?.widthCm ?? 100}
        heightCm={meta?.heightCm ?? 50}
        label="Preview"
      />
    </form>
  )
}
