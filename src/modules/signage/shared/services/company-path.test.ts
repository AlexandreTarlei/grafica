import { describe, expect, it } from 'vitest'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'

describe('companyApiPath', () => {
  it('builds path without leading slashes on segment', () => {
    expect(companyApiPath(42, 'products')).toBe('/companies/42/products')
  })

  it('strips slashes from segment', () => {
    expect(companyApiPath(1, '/quotes/')).toBe('/companies/1/quotes')
  })
})
