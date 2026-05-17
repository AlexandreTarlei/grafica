import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/forms/FormField'

type RhfTextareaProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  placeholder?: string
  className?: string
  rows?: number
}

export function RhfTextarea<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  className,
  rows = 4,
}: RhfTextareaProps<T>) {
  return (
    <FormField control={control} name={name} label={label} description={description} className={className}>
      {(field) => (
        <Textarea
          id={field.id}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={field['aria-invalid']}
          value={String(field.value ?? '')}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          ref={field.ref}
        />
      )}
    </FormField>
  )
}
