import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartAxisTick, chartGridProps, chartTooltipStyle, CHART_COLORS } from '@/modules/dashboard/charts/chart-theme'

type BarDatum = { label: string; value: number }

type DashboardBarChartProps = {
  data: BarDatum[]
  color?: string
}

export function DashboardBarChart({ data, color = CHART_COLORS.chart2 }: DashboardBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240} minWidth={0}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" tick={chartAxisTick} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={chartAxisTick} width={40} allowDecimals={false} />
        <Tooltip contentStyle={chartTooltipStyle} />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}
