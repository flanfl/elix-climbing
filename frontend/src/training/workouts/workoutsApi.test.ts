import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchWorkouts } from './workoutsApi'

function respondWith(status: number, body: unknown) {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
}

const wireWorkout = {
  id: '6f1c2a3e-0000-4000-8000-000000000001',
  performed_on: '2026-10-18',
  kind: 'bouldering',
  notes: 'Projected the red V5',
}

describe('fetchWorkouts', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the workouts in camelCase', async () => {
    respondWith(200, { data: [wireWorkout] })

    await expect(fetchWorkouts()).resolves.toEqual([
      {
        id: wireWorkout.id,
        performedOn: '2026-10-18',
        kind: 'bouldering',
        notes: 'Projected the red V5',
      },
    ])
  })

  it('accepts workouts without notes', async () => {
    respondWith(200, { data: [{ ...wireWorkout, notes: null }] })

    await expect(fetchWorkouts()).resolves.toMatchObject([{ notes: null }])
  })

  it('calls the API through the same origin, asking for JSON', async () => {
    respondWith(200, { data: [] })

    await fetchWorkouts()

    expect(fetch).toHaveBeenCalledWith(
      '/api/workouts',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('rejects on a non-200 status', async () => {
    respondWith(500, { errors: { detail: 'Internal Server Error' } })

    await expect(fetchWorkouts()).rejects.toThrow('Unexpected status 500')
  })

  it('rejects when the body has no data list', async () => {
    respondWith(200, [wireWorkout])

    await expect(fetchWorkouts()).rejects.toThrow('Unexpected response shape')
  })

  it('rejects when a workout has an unknown kind', async () => {
    respondWith(200, { data: [{ ...wireWorkout, kind: 'yoga' }] })

    await expect(fetchWorkouts()).rejects.toThrow('Unexpected response shape')
  })
})
