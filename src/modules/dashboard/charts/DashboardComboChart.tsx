import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TimeSeriesPoint } from '@/modules/financial/types'
import { formatCurrencyEUR } from '@/modules/financial/utils/format'
import {
  CHART_COLORS,
  chartAxisTick,
  chartGridProps,
  chartTooltipStyle,
} from '@/modules/dashboard/charts/chart-theme'

type DashboardComboChartProps = {
  data: TimeSeriesPoint[]
}

/** Crescimento: linha de tendência + área suave. */
export function DashboardComboChart({ data }: DashboardComboChartProps) {
  const enriched = data.map((p, i) => ({
    ...p,
    growth: i === 0 ? 0 : ((p.value - (data[i - 1]?.value ?? p.value)) / Math.max(1, data[i - 1]?.value ?? 1)) * 100,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240} minWidth={0}>
      <ComposedChart data={enriched} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="dashboardComboFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.chart3} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_COLORS.chart3} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...chartGridProps} />
        <XAxis
          dataKey="date"
          tick={chartAxisTick}
          tickFormatter={(v: string) => (v.length >= 10 ? v.slice(5) : v)}
          minTickGap={20}
        />
        <YAxis yAxisId="left" tick={chartAxisTick} width={48} />
        <YAxis yAxisId="right" orientation="right" tick={chartAxisTick} width={40} unit="%" />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value, name) => {
            const v = Number(value)
            if (name === 'growth') return [`${v.toFixed(1)}%`, 'Crescimento']
            return [formatCurrencyEUR(v), 'Valor']
          }}
        />
        <Area yAxisId="left" type="monotone" dataKey="value" fill="url(#dashboardComboFill)" stroke={CHART_COLORS.chart3} strokeWidth={0} />
        <Line yAxisId="right" type="monotone" dataKey="growth" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
