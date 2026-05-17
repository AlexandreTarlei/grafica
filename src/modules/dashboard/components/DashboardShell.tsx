import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type DashboardShellProps = {
  children: ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-8', className)}>{children}</div>
  )
}
