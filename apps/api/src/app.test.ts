import { describe, expect, it } from 'vitest'

import { app } from './app.js'

describe('health endpoint', () => {
  it('reports that the API is available', async () => {
    const response = await app.request('/api/health')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ status: 'ok' })
  })

  it('does not expose an unspecified route', async () => {
    const response = await app.request('/api/unknown')

    expect(response.status).toBe(404)
  })
})
