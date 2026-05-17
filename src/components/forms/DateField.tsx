import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const DateField = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  function DateField({ className, ...props }, ref) {
    return <Input ref={ref} type="date" className={cn('max-w-xs', className)} {...props} />
  },
)
