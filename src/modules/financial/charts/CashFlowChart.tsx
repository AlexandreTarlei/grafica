import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CashFlowPoint } from '@/modules/financial/types'
import { formatCurrencyEUR } from '@/modules/financial/utils/format'

type CashFlowChartProps = {
  data: CashFlowPoint[]
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280} minWidth={0}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          tickFormatter={(v: string) => (v.length >= 10 ? v.slice(5) : v)}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis tick={{ fontSize: 10 }} width={48} tickFormatter={(v) => `${Number(v) / 1000}k`} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
          }}
          formatter={(value, name) => [
            formatCurrencyEUR(Number(value)),
            name === 'entradas' ? 'Entradas' : name === 'saidas' ? 'Saídas' : 'Saldo',
          ]}
        />
        <Legend
          formatter={(value) =>
            value === 'entradas' ? 'Entradas' : value === 'saidas' ? 'Saídas' : 'Saldo acumulado'
          }
        />
        <Bar dataKey="entradas" fill="hsl(142 76% 36%)" radius={[2, 2, 0, 0]} maxBarSize={16} />
        <Bar dataKey="saidas" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} maxBarSize={16} />
        <Line type="monotone" dataKey="saldo" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
