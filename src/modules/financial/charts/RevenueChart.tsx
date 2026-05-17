import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TimeSeriesPoint } from '@/modules/financial/types'
import { formatCurrencyEUR } from '@/modules/financial/utils/format'

type RevenueChartProps = {
  data: TimeSeriesPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280} minWidth={0}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          tickFormatter={(v: string) => (v.length >= 10 ? v.slice(5) : v)}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis tick={{ fontSize: 10 }} width={48} tickFormatter={(v) => `${Number(v) / 1000}k`} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
          }}
          formatter={(value) => [formatCurrencyEUR(Number(value)), 'Faturamento']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(142 76% 36%)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
