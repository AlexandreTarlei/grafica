import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table'
import { Download, Package, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  DataTable,
  DataTableBulkBar,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableRowActions,
  DataTableToolbar,
  createSelectionColumn,
  downloadCsv,
  rowAction,
} from '@/components/data-table'
import { Button, buttonVariants } from '@/components/ui/button'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { formatCurrency } from '@/modules/signage/shared/utils/format'
import {
  listSignageProducts,
  signageProductsListKey,
} from '@/modules/signage/products/services/products.api'
import {
  SIGNAGE_CATEGORY_LABELS,
  SIGNAGE_PRODUCT_CATEGORIES,
  type SignageProduct,
  type SignageProductCategory,
} from '@/modules/signage/products/types'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

export function SignageProductsListPage() {
  const companyId = useCurrentCompanyId()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<SignageProductCategory | ''>('')
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const params = useMemo(
    () => ({ search, category, page, pageSize: PAGE_SIZE }),
    [search, category, page],
  )

  const { data, isLoading } = useQuery({
    queryKey: signageProductsListKey(companyId, params),
    queryFn: () => listSignageProducts(companyId as number, params),
    enabled: companyId != null,
  })

  const items = data?.items ?? []
  const selectedCount = Object.keys(rowSelection).length

  const exportSelected = () => {
    const selected = items.filter((r) => rowSelection[String(r.id)])
    if (selected.length === 0) return
    downloadCsv(
      'produtos-selecionados.csv',
      ['Nome', 'SKU', 'Categoria', 'Preço', 'Estado'],
      selected.map((p) => [
        p.name,
        p.sku,
        SIGNAGE_CATEGORY_LABELS[p.metadata.category],
        String(p.salePrice),
        p.active ? 'Ativo' : 'Inativo',
      ]),
    )
    toast.success(`${selected.length} produto(s) exportado(s)`)
  }

  const columns = useMemo<ColumnDef<SignageProduct>[]>(
    () => [
      createSelectionColumn<SignageProduct>(),
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
        cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span>,
      },
      {
        accessorKey: 'sku',
        header: ({ column }) => <DataTableColumnHeader column={column} title="SKU" />,
        meta: { className: 'hidden sm:table-cell' },
      },
      {
        id: 'category',
        accessorFn: (row) => SIGNAGE_CATEGORY_LABELS[row.metadata.category],
        header: ({ column }) => <DataTableColumnHeader column={column} title="Categoria" />,
        meta: { className: 'hidden md:table-cell' },
      },
      {
        accessorKey: 'salePrice',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Preço" align="right" className="w-full" />
        ),
        cell: ({ row }) => (
          <span className="block text-right tabular-nums">{formatCurrency(row.original.salePrice)}</span>
        ),
      },
      {
        id: 'active',
        accessorFn: (row) => (row.active ? 1 : 0),
        header: 'Estado',
        enableSorting: false,
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.active ? 'Ativo' : 'Inativo'}
            tone={row.original.active ? 'success' : 'muted'}
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          const href = `/admin/signage/produtos/${row.original.id}`
          return (
            <DataTableRowActions
              primaryHref={href}
              items={[
                rowAction('Ver detalhe', { kind: 'view', href }),
                rowAction('Editar', { kind: 'edit', href }),
              ]}
            />
          )
        },
      },
    ],
    [],
  )

  const total = data?.total ?? 0

  return (
    <PageShell
      title="Produtos personalizados"
      subtitle="Banners, lonas, fachadas, ACM e demais categorias de comunicação visual."
      actions={
        <Link to="/admin/signage/produtos/novo" className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="mr-1 size-4" />
          Novo produto
        </Link>
      }
    >
      <DataTableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
          setRowSelection({})
        }}
        searchPlaceholder="Buscar produto ou SKU…"
        resultCount={total}
        filters={
          <select
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as SignageProductCategory | '')
              setPage(1)
              setRowSelection({})
            }}
          >
            <option value="">Todas categorias</option>
            {SIGNAGE_PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {SIGNAGE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        }
      />
      <DataTableBulkBar selectedCount={selectedCount} onClear={() => setRowSelection({})}>
        <Button type="button" size="sm" variant="outline" onClick={exportSelected}>
          <Download className="mr-1 size-4" />
          Exportar seleção
        </Button>
      </DataTableBulkBar>
      <DataTable
        columns={columns}
        data={items}
        loading={isLoading}
        getRowId={(r) => String(r.id)}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        emptyState={{
          title: 'Nenhum produto encontrado',
          description: 'Ajuste os filtros ou crie o primeiro produto do catálogo.',
          icon: Package,
          action: { label: 'Novo produto', to: '/admin/signage/produtos/novo' },
        }}
      />
      {total > 0 ? (
        <DataTablePagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={(p) => {
            setPage(p)
            setRowSelection({})
          }}
        />
      ) : null}
    </PageShell>
  )
}
