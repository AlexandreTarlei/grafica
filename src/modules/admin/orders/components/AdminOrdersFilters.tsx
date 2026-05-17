import { Search } from 'lucide-react'
import { DataTableFilterBar } from '@/components/data-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AdminOrderListParams, AdminOrderStatus } from '@/modules/admin/orders/types'
import { cn } from '@/lib/utils'

const ALL = '__all__'

const STATUS_OPTIONS: { value: AdminOrderStatus | typeof ALL; label: string }[] = [
  { value: ALL, label: 'Todos os estados' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em_preparacao', label: 'Em preparação' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
]

type AdminOrdersFiltersProps = {
  values: Pick<AdminOrderListParams, 'search' | 'status' | 'dateFrom' | 'dateTo'>
  onChange: (patch: Partial<AdminOrderListParams>) => void
  onApply: () => void
  onReset: () => void
  className?: string
}

export function AdminOrdersFilters({
  values,
  onChange,
  onApply,
  onReset,
  className,
}: AdminOrdersFiltersProps) {
  const selectValue = values.status || ALL

  return (
    <div className={cn('bg-card flex flex-col gap-3 rounded-xl border p-4', className)}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar número, cliente ou ID…"
            className="pl-9"
            value={values.search}
            onChange={(e) => onChange({ search: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onApply()
            }}
          />
        </div>
        <Select
          value={selectValue}
          onValueChange={(v) => onChange({ status: v === ALL ? '' : (v as AdminOrderStatus) })}
        >
          <SelectTrigger className="w-full min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={String(o.value)} value={String(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-2">
          <Input
            type="date"
            aria-label="Desde"
            value={values.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
          />
          <Input
            type="date"
            aria-label="Até"
            value={values.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
          />
        </div>
      </div>
      <DataTableFilterBar onApply={onApply} onReset={onReset} applyLabel="Aplicar filtros" />
    </div>
  )
}
