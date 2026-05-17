import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TimeSeriesPoint } from '@/modules/financial/types'
import { formatCurrencyEUR } from '@/modules/financial/utils/format'

type SalesTrendChartProps = {
  data: TimeSeriesPoint[]
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280} minWidth={0}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          tickFormatter={(v: string) => (v.length >= 10 ? v.slice(5) : v)}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis tick={{ fontSize: 10 }} width={44} tickFormatter={(v) => `${Number(v) / 1000}k`} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
          }}
          formatter={(value) => [formatCurrencyEUR(Number(value)), 'Vendas']}
          labelFormatter={(l) => String(l)}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="url(#fillSales)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
