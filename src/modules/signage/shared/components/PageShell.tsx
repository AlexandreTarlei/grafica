import type { ReactNode } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'

type PageShellProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageShell({ title, subtitle, actions, children }: PageShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={subtitle} actions={actions} noMotion />
      {children}
    </div>
  )
}
