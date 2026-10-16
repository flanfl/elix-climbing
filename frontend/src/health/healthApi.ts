export type CheckResult = 'up' | 'down'

// Mirrors the backend's Climbing.Health.report() type. Keep the two in step by hand.
export interface HealthReport {
  status: 'ok' | 'degraded'
  checks: { database: CheckResult }
}

// A TypeScript type exists only at compile time. What arrives over the network is whatever
// the server sent, so `response.json()` cannot be trusted to match HealthReport. This guard
// checks the shape at runtime, and lets the compiler narrow `unknown` to HealthReport.
function isHealthReport(value: unknown): value is HealthReport {
  if (typeof value !== 'object' || value === null) return false
  const { status, checks } = value as Record<string, unknown>
  if (status !== 'ok' && status !== 'degraded') return false
  if (typeof checks !== 'object' || checks === null) return false
  const { database } = checks as Record<string, unknown>
  return database === 'up' || database === 'down'
}

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

  const body: unknown = await response.json()
  if (!isHealthReport(body)) {
    throw new Error('Unexpected response shape from /api/health')
  }
  return body
}
