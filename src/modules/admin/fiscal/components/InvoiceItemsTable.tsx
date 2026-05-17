import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import type { FiscalInvoiceItem } from '@/modules/admin/fiscal/types'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

export function InvoiceItemsTable({ items }: { items: FiscalInvoiceItem[] }) {
  const columns = useMemo<ColumnDef<FiscalInvoiceItem>[]>(
    () => [
      { accessorKey: 'numeroItem', header: '#', meta: { className: 'w-12' } },
      { accessorKey: 'descricao', header: 'Descrição', cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span> },
      { accessorKey: 'ncm', header: 'NCM', meta: { className: 'hidden lg:table-cell font-mono text-xs' } },
      { accessorKey: 'cfop', header: 'CFOP', meta: { className: 'hidden xl:table-cell font-mono text-xs' } },
      { accessorKey: 'cstIcms', header: 'CST', meta: { className: 'hidden xl:table-cell font-mono text-xs' } },
      {
        accessorKey: 'quantidade',
        header: () => <span className="block text-right">Qtd</span>,
        cell: ({ getValue }) => <span className="block text-right tabular-nums">{Number(getValue())}</span>,
      },
      {
        accessorKey: 'valorUnitario',
        header: () => <span className="block text-right">Unit.</span>,
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums">{formatMoney(Number(getValue()))}</span>
        ),
      },
      {
        accessorKey: 'valorBruto',
        header: () => <span className="block text-right">Bruto</span>,
        cell: ({ getValue }) => (
          <span className="block text-right tabular-nums">{formatMoney(Number(getValue()))}</span>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      density="dense"
      getRowId={(r) => String(r.numeroItem)}
      emptyState={{ title: 'Nota sem itens', description: 'Não há linhas detalhadas nesta nota.' }}
    />
  )
}
