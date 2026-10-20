import { z } from 'zod'

// Exported on its own: the URL query string and the workout form will validate `kind` with it.
export const WorkoutKindSchema = z.enum(['bouldering', 'lead', 'hangboard', 'conditioning'])

// Mirrors the backend's ClimbingWeb.WorkoutJSON.data/1. Keep the two in step by hand.
// The schema describes the wire format (snake_case); the transform hands the rest of the
// frontend its own camelCase shape, so the wire format stays confined to this file.
const WorkoutSchema = z
  .object({
    id: z.string(),
    // JSON has no date type, so Ecto's :date arrives as an ISO 8601 string ("2026-10-18").
    performed_on: z.iso.date(),
    kind: WorkoutKindSchema,
    notes: z.string().nullable(),
  })
  .transform(({ performed_on, ...rest }) => ({ ...rest, performedOn: performed_on }))

const WorkoutsResponseSchema = z.object({ data: z.array(WorkoutSchema) })

export type WorkoutKind = z.infer<typeof WorkoutKindSchema>
// z.infer gives the type after the transform, i.e. the camelCase shape.
export type Workout = z.infer<typeof WorkoutSchema>

export async function fetchWorkouts(signal?: AbortSignal): Promise<Workout[]> {
  const response = await fetch('/api/workouts', {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (response.status !== 200) {
    throw new Error(`Unexpected status ${response.status} from /api/workouts`)
  }

  const parsed = WorkoutsResponseSchema.safeParse(await response.json())
  if (!parsed.success) {
    throw new Error('Unexpected response shape from /api/workouts')
  }
  return parsed.data.data
}
