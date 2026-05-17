import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { maskCnpj, maskPhonePt, maskPostalCodePt } from '@/lib/masks'
import { cn } from '@/lib/utils'

export type MaskType = 'cnpj' | 'phone' | 'postalCodePt'

const maskFns: Record<MaskType, (v: string) => string> = {
  cnpj: maskCnpj,
  phone: maskPhonePt,
  postalCodePt: maskPostalCodePt,
}

type MaskedInputProps = Omit<React.ComponentProps<typeof Input>, 'onChange'> & {
  mask: MaskType
  onChange: (value: string) => void
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput({ mask, value, onChange, className, ...props }, ref) {
    const apply = maskFns[mask]
    return (
      <Input
        ref={ref}
        className={cn(className)}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(apply(e.target.value))}
        {...props}
      />
    )
  },
)
