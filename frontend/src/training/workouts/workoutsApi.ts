export type WorkoutKind = 'bouldering' | 'lead' | 'hangboard' | 'conditioning'

// Mirrors the backend's ClimbingWeb.WorkoutJSON.data/1. Keep the two in step by hand.
export interface Workout {
  id: string
  // ISO 8601 date ("2026-10-18"): JSON has no date type, so Ecto's :date arrives as a string.
  performedOn: string
  kind: WorkoutKind
  notes: string | null
}

const KINDS: readonly string[] = ['bouldering', 'lead', 'hangboard', 'conditioning']

// Checks one item of the wire format and converts it to the frontend's camelCase shape.
// Returns null rather than throwing, so the caller decides how to report the bad payload.
function toWorkout(value: unknown): Workout | null {
  if (typeof value !== 'object' || value === null) return null
  const { id, performed_on, kind, notes } = value as Record<string, unknown>
  if (typeof id !== 'string') return null
  if (typeof performed_on !== 'string') return null
  if (typeof kind !== 'string' || !KINDS.includes(kind)) return null
  if (notes !== null && typeof notes !== 'string') return null
  return { id, performedOn: performed_on, kind: kind as WorkoutKind, notes }
}

export async function fetchWorkouts(signal?: AbortSignal): Promise<Workout[]> {
  const response = await fetch('/api/workouts', {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (response.status !== 200) {
    throw new Error(`Unexpected status ${response.status} from /api/workouts`)
  }

  const body: unknown = await response.json()
  const data = typeof body === 'object' && body !== null ? (body as { data?: unknown }).data : null
  if (!Array.isArray(data)) {
    throw new Error('Unexpected response shape from /api/workouts')
  }

  const workouts = data.map(toWorkout)
  if (workouts.some((workout) => workout === null)) {
    throw new Error('Unexpected response shape from /api/workouts')
  }
  return workouts as Workout[]
}
