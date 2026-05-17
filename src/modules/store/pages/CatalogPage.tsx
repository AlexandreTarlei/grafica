import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Seo } from '@/modules/commercial/seo/Seo'
import { CatalogPagination, CATALOG_PAGE_SIZE } from '@/modules/store/components/CatalogPagination'
import { ProductFilters, parseCatalogSort } from '@/modules/store/components/ProductFilters'
import { ProductGrid } from '@/modules/store/components/ProductGrid'
import { useStoreProducts } from '@/modules/store/hooks/useStoreProducts'
import { sortCatalogProducts } from '@/modules/store/utils/catalog-sort'
import { catalogSortToApi } from '@/modules/store/utils/catalog-sort-api'
import type { SignageProductCategory } from '@/modules/signage/products/types'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const categoria = (params.get('categoria') ?? '') as SignageProductCategory | ''
  const sort = parseCatalogSort(params.get('sort'))
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1)

  const listParams = useMemo(
    () => ({
      search: q || undefined,
      category: categoria || undefined,
      sort: catalogSortToApi(sort),
      pageSize: CATALOG_PAGE_SIZE,
      page,
    }),
    [q, categoria, sort, page],
  )

  const { data, isLoading, isFetching } = useStoreProducts(listParams)

  const products = useMemo(
    () => sortCatalogProducts(data?.items ?? [], sort),
    [data?.items, sort],
  )

  const clearFilters = () => setParams(new URLSearchParams())

  return (
    <PageContainer>
      <Seo title="Produtos" description="Catálogo de comunicação visual." canonicalPath="/produtos" />
      <PageHeader
        noMotion
        title="Produtos"
        description="Banners, fachadas, envelopamento e muito mais."
        className="mb-4"
      />

      <ProductFilters resultCount={data?.total} />

      <div className="mt-8">
        <ProductGrid
          products={products}
          loading={isLoading || (isFetching && !data)}
          empty={
            <EmptyState
              title="Nenhum produto encontrado"
              description="Tente outra pesquisa ou remova os filtros."
            >
              <Button type="button" variant="outline" className="mt-4" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </EmptyState>
          }
        />
        {data ? <CatalogPagination total={data.total} /> : null}
      </div>
    </PageContainer>
  )
}
