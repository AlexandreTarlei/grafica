import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '@/components/data-table'
import {
  FormActions,
  FormField,
  FormSection,
  MaskedInput,
} from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import {
  corporateClientsKey,
  createCorporateClient,
  listCorporateClients,
} from '@/modules/signage/clients/services/customers.api'
import {
  corporateClientFormSchema,
  type CorporateClientFormInput,
} from '@/modules/signage/clients/schemas/client.schema'
import type { ClientContact, CorporateClient } from '@/modules/signage/clients/types'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'

export function ClientsPage() {
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [formOpen, setFormOpen] = useState(false)

  const form = useForm<CorporateClientFormInput>({
    resolver: zodResolver(corporateClientFormSchema),
    defaultValues: { legalName: '', cnpj: '', contactName: '' },
    mode: 'onBlur',
  })

  const { data = [], isLoading } = useQuery({
    queryKey: corporateClientsKey(companyId, search),
    queryFn: () => listCorporateClients(companyId as number, search),
    enabled: companyId != null,
  })

  const createMut = useMutation({
    mutationFn: (values: CorporateClientFormInput) =>
      createCorporateClient(companyId as number, {
        legalName: values.legalName,
        cnpj: values.cnpj,
        contacts: [{ id: '1', name: values.contactName }] as ClientContact[],
        recurring: false,
      }),
    onSuccess: () => {
      toast.success('Cliente criado')
      setFormOpen(false)
      form.reset()
      void qc.invalidateQueries({ queryKey: corporateClientsKey(companyId, search) })
    },
  })

  const columns = useMemo<ColumnDef<CorporateClient>[]>(
    () => [
      {
        accessorKey: 'legalName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Razão social" />,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.legalName}</p>
            {row.original.tradeName ? (
              <p className="text-muted-foreground text-xs">{row.original.tradeName}</p>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'cnpj',
        header: ({ column }) => <DataTableColumnHeader column={column} title="CNPJ" />,
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span>,
      },
      {
        id: 'recurring',
        accessorFn: (row) => (row.recurring ? 1 : 0),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) =>
          row.original.recurring ? (
            <StatusBadge label="Recorrente" tone="success" />
          ) : (
            <StatusBadge label="Pontual" tone="muted" />
          ),
      },
      {
        id: 'summary',
        accessorFn: (row) => row.quotesCount + row.ordersCount,
        header: 'Resumo',
        enableSorting: false,
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.quotesCount} orç. · {row.original.ordersCount} ped.
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <PageShell
      title="Clientes corporativos"
      subtitle="CNPJ, múltiplos contactos, histórico e recorrência."
      actions={
        <Button size="sm" onClick={() => setFormOpen((o) => !o)}>
          {formOpen ? 'Cancelar' : 'Novo cliente'}
        </Button>
      }
    >
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar razão social ou CNPJ…"
        resultCount={data.length}
      />
      {formOpen ? (
        <form
          className="max-w-lg"
          onSubmit={form.handleSubmit((v) => createMut.mutate(v))}
          noValidate
        >
          <FormSection title="Novo cliente corporativo">
            <FormField control={form.control} name="legalName" label="Razão social">
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
            <FormField control={form.control} name="cnpj" label="CNPJ">
              {(field) => (
                <MaskedInput
                  mask="cnpj"
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  value={String(field.value ?? '')}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  placeholder="00.000.000/0000-00"
                />
              )}
            </FormField>
            <FormField control={form.control} name="contactName" label="Contacto principal">
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
            <FormActions
              submitLabel="Guardar cliente"
              loading={createMut.isPending}
              onCancel={() => {
                setFormOpen(false)
                form.reset()
              }}
            />
          </FormSection>
        </form>
      ) : null}
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        getRowId={(r) => String(r.id)}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyState={{
          title: 'Nenhum cliente',
          description: 'Adicione o primeiro cliente corporativo.',
          icon: Users,
        }}
      />
    </PageShell>
  )
}
