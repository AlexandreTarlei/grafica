import { describe, expect, it } from 'vitest'
import type { AddCartItemInput } from '@/modules/ecommerce/cart/types'

describe('AddCartItemInput contract', () => {
  it('accepts graphics customization fields', () => {
    const input: AddCartItemInput = {
      productId: '42',
      quantidade: 2,
      widthCm: 120,
      heightCm: 80,
      notes: 'Furo nos cantos',
      artworkAssetId: 7,
    }
    expect(input.widthCm).toBe(120)
    expect(input.artworkAssetId).toBe(7)
  })
})
