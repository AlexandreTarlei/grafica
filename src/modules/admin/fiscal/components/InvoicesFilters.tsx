import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FiscalInvoiceListParams, FiscalInvoiceStatus } from '@/modules/admin/fiscal/types'
import { cn } from '@/lib/utils'

const ALL = '__all__'

const STATUS_OPTIONS: { value: FiscalInvoiceStatus | typeof ALL; label: string }[] = [
  { value: ALL, label: 'Todos os estados' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'processando', label: 'A processar' },
  { value: 'emitida', label: 'Emitida' },
  { value: 'rejeitada', label: 'Rejeitada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'inutilizada', label: 'Inutilizada' },
]

type InvoicesFiltersProps = {
  values: Pick<FiscalInvoiceListParams, 'search' | 'status' | 'dateFrom' | 'dateTo'>
  onChange: (patch: Partial<FiscalInvoiceListParams>) => void
  onApply: () => void
  onReset: () => void
  className?: string
}

export function InvoicesFilters({
  values,
  onChange,
  onApply,
  onReset,
  className,
}: InvoicesFiltersProps) {
  const selectValue = values.status || ALL

  return (
    <div className={cn('bg-card flex flex-col gap-3 rounded-xl border p-4', className)}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar número, chave NF-e ou cliente…"
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
          onValueChange={(v) =>
            onChange({ status: v === ALL ? '' : (v as FiscalInvoiceStatus) })
          }
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
        <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
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
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onApply}>
          Aplicar filtros
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onReset}>
          Limpar
        </Button>
      </div>
    </div>
  )
}
