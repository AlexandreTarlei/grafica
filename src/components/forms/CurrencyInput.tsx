import { forwardRef, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/masks'
import { cn } from '@/lib/utils'

type CurrencyInputProps = Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> & {
  value: number
  onChange: (value: number) => void
  locale?: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ value, onChange, locale = 'pt-BR', className, ...props }, ref) {
    const [display, setDisplay] = useState(() => formatCurrencyInput(value, locale))

    useEffect(() => {
      setDisplay(formatCurrencyInput(value, locale))
    }, [value, locale])

    return (
      <Input
        ref={ref}
        inputMode="decimal"
        placeholder="0,00"
        className={cn('tabular-nums', className)}
        value={display}
        onChange={(e) => {
          const next = e.target.value
          setDisplay(next)
          onChange(parseCurrencyInput(next))
        }}
        onBlur={() => setDisplay(formatCurrencyInput(value, locale))}
        {...props}
      />
    )
  },
)
