/** Estilos partilhados Recharts — compatível com tokens OKLCH do tema. */
export const CHART_COLORS = {
  primary: 'var(--primary)',
  chart1: 'var(--chart-1)',
  chart2: 'var(--chart-2)',
  chart3: 'var(--chart-3)',
  chart4: 'var(--chart-4)',
  chart5: 'var(--chart-5)',
  muted: 'var(--muted-foreground)',
  border: 'var(--border)',
  card: 'var(--card)',
  foreground: 'var(--foreground)',
} as const

import type { CSSProperties } from 'react'

export const chartTooltipStyle: CSSProperties = {
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--card)',
  color: 'var(--foreground)',
  fontSize: 12,
  boxShadow: 'var(--shadow-elevated)',
}

export const chartGridProps = {
  strokeDasharray: '3 3',
  className: 'stroke-border/60',
  vertical: false,
} as const

export const chartAxisTick = { fontSize: 11, fill: 'var(--muted-foreground)' } as const
