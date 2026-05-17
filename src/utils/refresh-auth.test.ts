import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '@/core/constants'

describe('STORAGE_KEYS', () => {
  it('includes refresh token key for session persistence', () => {
    expect(STORAGE_KEYS.refreshToken).toBe('saas_refresh_token')
  })
})
