import type { ReportSummary } from '@/modules/financial/types'

/** Exportação CSV no browser (dados já carregados; relatório definitivo deve vir do backend). */
export function downloadFinancialReportCsv(report: ReportSummary): void {
  const lines: string[][] = [
    ['Métrica', 'Valor'],
    ['Faturamento', String(report.totalFaturamento)],
    ['Lucro', String(report.totalLucro)],
    ['Pedidos', String(report.totalPedidos)],
    ['Ticket médio', String(report.ticketMedio)],
    [],
    ['Categoria', 'Valor', 'Percentagem'],
    ...report.porCategoria.map((c) => [c.categoria, String(c.valor), String(c.percentagem)]),
  ]
  const csv = lines.map((r) => r.join(';')).join('\n')
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-financeiro-${report.periodo.from}_${report.periodo.to}.csv`
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(url)
}
