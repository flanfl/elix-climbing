import { z } from 'zod'

// A TypeScript type exists only at compile time. What arrives over the network is whatever
// the server sent, so `response.json()` cannot be trusted to match a type. A schema checks the
// shape at runtime, and `z.infer` derives the type from it, so the two cannot drift apart.
// Mirrors the backend's Climbing.Health.report() type. Keep the two in step by hand.
const CheckResultSchema = z.enum(['up', 'down'])

const HealthReportSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  checks: z.object({ database: CheckResultSchema }),
})

export type CheckResult = z.infer<typeof CheckResultSchema>
export type HealthReport = z.infer<typeof HealthReportSchema>

export async function fetchHealth(signal?: AbortSignal): Promise<HealthReport> {
  // Relative URL: same origin as the page. In dev, Vite proxies /api to Phoenix.
  const response = await fetch('/api/health', {
    headers: { Accept: 'application/json' },
    signal,
  })

  // 503 is how the API says "reachable, but degraded"; it still carries a report.
  if (response.status !== 200 && response.status !== 503) {
    throw new Error(`Unexpected status ${response.status} from /api/health`)
  }

  // safeParse returns a result instead of throwing, so the error message stays ours.
  const parsed = HealthReportSchema.safeParse(await response.json())
  if (!parsed.success) {
    throw new Error('Unexpected response shape from /api/health')
  }
  return parsed.data
}
