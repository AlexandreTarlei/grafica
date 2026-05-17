import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  as?: 'h1' | 'h2'
  noMotion?: boolean
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  as: Tag = 'h1',
  noMotion = false,
}: PageHeaderProps) {
  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <Tag className={cn(Tag === 'h1' ? 'page-title' : 'section-title')}>{title}</Tag>
        {description ? (
          <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </>
  )

  const wrapperClass = cn(
    'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
    className,
  )

  if (noMotion) {
    return <div className={wrapperClass}>{inner}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={wrapperClass}
    >
      {inner}
    </motion.div>
  )
}
