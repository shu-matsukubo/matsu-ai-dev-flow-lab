import { describe, expect, it, vi } from 'vitest'

import { fetchHealth } from './health.js'

describe('fetchHealth', () => {
  it('returns a validated health response', async () => {
    const fetcher = vi.fn(async () =>
      Response.json({ status: 'ok' }),
    ) as unknown as typeof fetch

    await expect(fetchHealth(fetcher)).resolves.toEqual({ status: 'ok' })
    expect(fetcher).toHaveBeenCalledWith('/api/health', {
      headers: { Accept: 'application/json' },
    })
  })

  it('rejects a non-success response', async () => {
    const fetcher = vi.fn(async () =>
      Response.json({ status: 'error' }, { status: 503 }),
    ) as unknown as typeof fetch

    await expect(fetchHealth(fetcher)).rejects.toThrow(
      'Health request failed with status 503',
    )
  })
})
