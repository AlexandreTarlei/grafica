import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { FolderOpen } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable, DataTableColumnHeader } from '@/components/data-table'
import { FormActions, FormField, FormSection } from '@/components/forms'
import { Input } from '@/components/ui/input'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import {
  createSignageCategory,
  listSignageCategories,
  signageCategoriesKey,
} from '@/modules/signage/products/services/categories.api'
import {
  signageCategoryFormSchema,
  type SignageCategoryFormInput,
} from '@/modules/signage/products/schemas/category.schema'
import type { SignageCategory } from '@/modules/signage/products/types'
import { PageShell } from '@/modules/signage/shared/components/PageShell'

export function SignageCategoriesPage() {
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()
  const [sorting, setSorting] = useState<SortingState>([])

  const form = useForm<SignageCategoryFormInput>({
    resolver: zodResolver(signageCategoryFormSchema),
    defaultValues: { name: '' },
    mode: 'onBlur',
  })

  const { data = [], isLoading } = useQuery({
    queryKey: signageCategoriesKey(companyId),
    queryFn: () => listSignageCategories(companyId as number),
    enabled: companyId != null,
  })

  const createMut = useMutation({
    mutationFn: (values: SignageCategoryFormInput) =>
      createSignageCategory(companyId as number, { name: values.name }),
    onSuccess: () => {
      form.reset()
      void qc.invalidateQueries({ queryKey: signageCategoriesKey(companyId) })
      toast.success('Categoria criada')
    },
  })

  const columns = useMemo<ColumnDef<SignageCategory>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
        cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span>,
      },
      {
        accessorKey: 'slug',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ getValue }) => (
          <span className="text-muted-foreground font-mono text-xs">{String(getValue())}</span>
        ),
      },
    ],
    [],
  )

  return (
    <PageShell title="Categorias" subtitle="Categorias do catálogo ligadas ao backend.">
      <form
        className="max-w-md"
        onSubmit={form.handleSubmit((v) => createMut.mutate(v))}
        noValidate
      >
        <FormSection>
          <div className="flex flex-wrap items-end gap-3">
            <FormField control={form.control} name="name" label="Nome da categoria" className="min-w-[200px] flex-1">
              {(field) => (
                <Input
                  id={field.id}
                  placeholder="Ex.: Banners"
                  aria-invalid={field['aria-invalid']}
                  value={String(field.value ?? '')}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            </FormField>
            <FormActions submitLabel="Adicionar" loading={createMut.isPending} className="border-0 pt-0" />
          </div>
        </FormSection>
      </form>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        density="dense"
        getRowId={(r) => String(r.id)}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyState={{
          title: 'Sem categorias',
          description: 'Crie a primeira categoria do catálogo.',
          icon: FolderOpen,
        }}
      />
    </PageShell>
  )
}
