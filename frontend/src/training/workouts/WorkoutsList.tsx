import { useEffect, useState } from 'react'
import { fetchWorkouts, type Workout } from './workoutsApi'

type State = { kind: 'loading' } | { kind: 'loaded'; workouts: Workout[] } | { kind: 'failed' }

function WorkoutsList() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    fetchWorkouts(controller.signal)
      .then((workouts) => setState({ kind: 'loaded', workouts }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: 'failed' })
      })

    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="workouts-heading">
      <h2 id="workouts-heading">Workouts</h2>
      <WorkoutsContent state={state} />
    </section>
  )
}

function WorkoutsContent({ state }: { state: State }) {
  switch (state.kind) {
    case 'loading':
      return <p role="status">Loading workouts…</p>
    case 'failed':
      return <p role="alert">Could not load workouts</p>
    case 'loaded':
      if (state.workouts.length === 0) return <p>No workouts yet</p>
      return (
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Kind</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {state.workouts.map((workout) => (
              <tr key={workout.id}>
                <td>
                  <time dateTime={workout.performedOn}>{workout.performedOn}</time>
                </td>
                <td>{workout.kind}</td>
                <td>{workout.notes ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    default: {
      const unhandled: never = state
      return unhandled
    }
  }
}

export default WorkoutsList
