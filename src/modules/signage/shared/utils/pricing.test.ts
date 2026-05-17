import { describe, expect, it } from 'vitest'
import { calculateLineSubtotal, calculateQuoteTotals } from '@/modules/signage/shared/utils/pricing'

describe('pricing', () => {
  it('calculates line subtotal from area and quantity', () => {
    const subtotal = calculateLineSubtotal({
      category: 'banner',
      widthCm: 100,
      heightCm: 100,
      quantity: 2,
      unitPrice: 100,
    })
    expect(subtotal).toBeGreaterThan(0)
  })

  it('aggregates quote totals with tax', () => {
    const totals = calculateQuoteTotals(
      [
        {
          category: 'adesivo',
          widthCm: 50,
          heightCm: 50,
          quantity: 1,
          unitPrice: 200,
        },
      ],
      { taxPercent: 10 },
    )
    expect(totals.subtotal).toBe(200)
    expect(totals.total).toBeGreaterThan(totals.subtotal)
  })
})
