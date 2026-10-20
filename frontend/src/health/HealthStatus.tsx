import { useEffect, useState } from 'react'
import { fetchHealth, type HealthReport } from './healthApi'

// One state per thing the user can see. A discriminated union makes impossible combinations
// (loading AND a report, say) unrepresentable. It does NOT, on its own, force the switch below
// to handle every case: a missing case compiles fine. The `never` guard in `default` does.
type State =
  { kind: 'loading' } | { kind: 'loaded'; report: HealthReport } | { kind: 'unreachable' }

function describe(report: HealthReport): string {
  if (report.status === 'ok') return 'API ok'
  const failing = Object.entries(report.checks)
    .filter(([, result]) => result === 'down')
    .map(([name]) => `${name} down`)
  return `API ${report.status}: ${failing.join(', ')}`
}

function HealthStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    // Cancels the request if the component goes away before the answer (and in dev, where
    // StrictMode mounts, unmounts and remounts every component once to expose such bugs).
    const controller = new AbortController()

    fetchHealth(controller.signal)
      .then((report) => setState({ kind: 'loaded', report }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: 'unreachable' })
      })

    return () => controller.abort()
  }, [])

  switch (state.kind) {
    case 'loading':
      return (
        <p role="status" className="text-sm text-muted-foreground">
          Checking the API…
        </p>
      )
    case 'loaded':
      return (
        <p role="status" className="text-sm text-muted-foreground">
          {describe(state.report)}
        </p>
      )
    case 'unreachable':
      return (
        <p role="alert" className="text-sm text-destructive">
          API unreachable
        </p>
      )
    default: {
      // Adding a State variant without handling it above makes this line a compile error.
      const unhandled: never = state
      return unhandled
    }
  }
}

export default HealthStatus
