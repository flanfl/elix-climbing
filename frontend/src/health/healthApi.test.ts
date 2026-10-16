import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchHealth } from './healthApi'

function respondWith(status: number, body: unknown) {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
}

describe('fetchHealth', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the report when the API is healthy', async () => {
    respondWith(200, { status: 'ok', checks: { database: 'up' } })

    await expect(fetchHealth()).resolves.toEqual({ status: 'ok', checks: { database: 'up' } })
  })

  it('returns the report when the API is degraded: 503 is an answer, not a failure', async () => {
    respondWith(503, { status: 'degraded', checks: { database: 'down' } })

    await expect(fetchHealth()).resolves.toEqual({
      status: 'degraded',
      checks: { database: 'down' },
    })
  })

  it('calls the API through the same origin, asking for JSON', async () => {
    respondWith(200, { status: 'ok', checks: { database: 'up' } })

    await fetchHealth()

    expect(fetch).toHaveBeenCalledWith(
      '/api/health',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('rejects on any other status', async () => {
    respondWith(500, { errors: { detail: 'Internal Server Error' } })

    await expect(fetchHealth()).rejects.toThrow('Unexpected status 500')
  })

  it('rejects when the body is not a health report, whatever the status', async () => {
    respondWith(200, { status: 'banana', checks: { database: 'sideways' } })

    await expect(fetchHealth()).rejects.toThrow('Unexpected response shape')
  })

  it('rejects when the network call itself fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(fetchHealth()).rejects.toThrow('Failed to fetch')
  })
})
