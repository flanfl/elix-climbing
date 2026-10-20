import { useQuery } from '@tanstack/react-query'
import type { HealthReport } from './healthApi'
import { healthQuery } from './healthQueries'

function describe(report: HealthReport): string {
  if (report.status === 'ok') return 'API ok'
  const failing = Object.entries(report.checks)
    .filter(([, result]) => result === 'down')
    .map(([name]) => `${name} down`)
  return `API ${report.status}: ${failing.join(', ')}`
}

function HealthStatus() {
  // The result is a discriminated union on `status`, so the switch below narrows it: `data` only
  // exists in the 'success' branch. Query also cancels the request if the component goes away.
  const query = useQuery(healthQuery)

  switch (query.status) {
    case 'pending':
      return (
        <p role="status" className="text-sm text-muted-foreground">
          Checking the API…
        </p>
      )
    case 'success':
      return (
        <p role="status" className="text-sm text-muted-foreground">
          {describe(query.data)}
        </p>
      )
    case 'error':
      return (
        <p role="alert" className="text-sm text-destructive">
          API unreachable
        </p>
      )
    default: {
      // A status added by a future Query version without a case above is a compile error here.
      const unhandled: never = query
      return unhandled
    }
  }
}

export default HealthStatus
