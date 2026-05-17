import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { ProductForm } from '@/modules/signage/products/components/ProductForm'
import {
  createSignageProduct,
  signageProductsListKey,
} from '@/modules/signage/products/services/products.api'
import { defaultMetadata, type SignageProductFormValues } from '@/modules/signage/products/types'
import { PageShell } from '@/modules/signage/shared/components/PageShell'

const initial: SignageProductFormValues = {
  name: '',
  sku: '',
  salePrice: 0,
  active: true,
  categoryId: null,
  metadata: defaultMetadata(),
}

export function SignageProductCreatePage() {
  const companyId = useCurrentCompanyId()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (values: SignageProductFormValues) => createSignageProduct(companyId as number, values),
    onSuccess: (p) => {
      void qc.invalidateQueries({ queryKey: signageProductsListKey(companyId, {}) })
      toast.success('Produto criado')
      navigate(`/admin/signage/produtos/${p.id}`)
    },
    onError: () => toast.error('Erro ao criar produto'),
  })

  return (
    <PageShell title="Novo produto" subtitle="Cadastro com medidas, materiais e arte.">
      <ProductForm initial={initial} onSubmit={(v) => mutation.mutate(v)} submitting={mutation.isPending} submitLabel="Criar" />
    </PageShell>
  )
}
