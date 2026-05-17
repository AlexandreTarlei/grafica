import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageContainerProps = {
  children: ReactNode
  className?: string
  fullWidth?: boolean
  tight?: boolean
  noMotion?: boolean
}

export function PageContainer({
  children,
  className,
  fullWidth = false,
  tight = false,
  noMotion = false,
}: PageContainerProps) {
  const classes = cn(
    'mx-auto w-full',
    !fullWidth && 'max-w-6xl px-4 md:px-6',
    !tight && 'py-8',
    className,
  )

  if (noMotion) {
    return <div className={classes}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={classes}
    >
      {children}
    </motion.div>
  )
}
