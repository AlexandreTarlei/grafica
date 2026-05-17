import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { ProductForm } from '@/modules/signage/products/components/ProductForm'
import {
  getSignageProduct,
  signageProductDetailKey,
  signageProductsListKey,
  updateSignageProduct,
} from '@/modules/signage/products/services/products.api'
import type { SignageProductFormValues } from '@/modules/signage/products/types'
import { PageShell } from '@/modules/signage/shared/components/PageShell'

export function SignageProductDetailPage() {
  const { productId } = useParams()
  const id = Number(productId)
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: signageProductDetailKey(companyId, id),
    queryFn: () => getSignageProduct(companyId as number, id),
    enabled: companyId != null && Number.isFinite(id),
  })

  const mutation = useMutation({
    mutationFn: (values: SignageProductFormValues) => updateSignageProduct(companyId as number, id, values),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: signageProductDetailKey(companyId, id) })
      void qc.invalidateQueries({ queryKey: signageProductsListKey(companyId, {}) })
      toast.success('Produto atualizado')
    },
    onError: () => toast.error('Erro ao atualizar'),
  })

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full" />
  }

  const initial: SignageProductFormValues = {
    name: data.name,
    sku: data.sku,
    salePrice: data.salePrice,
    active: data.active,
    categoryId: data.categoryId,
    metadata: data.metadata,
  }

  return (
    <PageShell title={data.name} subtitle={`SKU ${data.sku}`}>
      <ProductForm
        initial={initial}
        onSubmit={(v) => mutation.mutate(v)}
        submitting={mutation.isPending}
        submitLabel="Guardar alterações"
      />
    </PageShell>
  )
}
