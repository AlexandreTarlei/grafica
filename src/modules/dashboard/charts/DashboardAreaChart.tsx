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
import {
  CHART_COLORS,
  chartAxisTick,
  chartGridProps,
  chartTooltipStyle,
} from '@/modules/dashboard/charts/chart-theme'

type DashboardAreaChartProps = {
  data: TimeSeriesPoint[]
  dataKey?: string
  formatValue?: (v: number) => string
  color?: string
}

export function DashboardAreaChart({
  data,
  dataKey = 'value',
  formatValue = formatCurrencyEUR,
  color = CHART_COLORS.primary,
}: DashboardAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240} minWidth={0}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="dashboardAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...chartGridProps} />
        <XAxis
          dataKey="date"
          tick={chartAxisTick}
          tickFormatter={(v: string) => (v.length >= 10 ? v.slice(5) : v)}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tick={chartAxisTick}
          width={48}
          tickFormatter={(v) => `${Number(v) >= 1000 ? `${Math.round(Number(v) / 1000)}k` : v}`}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value) => [formatValue(Number(value)), '']}
          labelFormatter={(l) => String(l)}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill="url(#dashboardAreaFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
