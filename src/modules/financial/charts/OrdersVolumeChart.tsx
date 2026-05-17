import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TimeSeriesPoint } from '@/modules/financial/types'
import { formatNumberPt } from '@/modules/financial/utils/format'

type OrdersVolumeChartProps = {
  data: TimeSeriesPoint[]
}

export function OrdersVolumeChart({ data }: OrdersVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280} minWidth={0}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          tickFormatter={(v: string) => (v.length >= 10 ? v.slice(5) : v)}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis tick={{ fontSize: 10 }} width={36} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
          }}
          formatter={(value) => [formatNumberPt(Number(value)), 'Pedidos']}
        />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.85} />
      </BarChart>
    </ResponsiveContainer>
  )
}
