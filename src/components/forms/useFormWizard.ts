import { useCallback, useState } from 'react'
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

export function useFormWizard<T extends FieldValues>(
  form: UseFormReturn<T>,
  steps: readonly string[],
  fieldsByStep: readonly (readonly FieldPath<T>[])[],
) {
  const [step, setStep] = useState(0)

  const next = useCallback(async () => {
    const fields = fieldsByStep[step] ?? []
    const ok = fields.length === 0 ? true : await form.trigger(fields as FieldPath<T>[])
    if (ok) setStep((s) => Math.min(steps.length - 1, s + 1))
  }, [form, step, fieldsByStep, steps.length])

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setStep(Math.max(0, Math.min(steps.length - 1, index)))
    },
    [steps.length],
  )

  return {
    step,
    steps,
    isFirst: step === 0,
    isLast: step === steps.length - 1,
    next,
    prev,
    goTo,
    label: steps[step],
  }
}
