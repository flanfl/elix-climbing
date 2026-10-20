import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
    <section aria-labelledby="workouts-heading" className="space-y-4">
      <h2 id="workouts-heading" className="text-2xl font-semibold tracking-tight">
        Workouts
      </h2>
      <WorkoutsContent state={state} />
    </section>
  )
}

function WorkoutsContent({ state }: { state: State }) {
  switch (state.kind) {
    case 'loading':
      return (
        <p role="status" className="text-muted-foreground">
          Loading workouts…
        </p>
      )
    case 'failed':
      return (
        <p role="alert" className="text-destructive">
          Could not load workouts
        </p>
      )
    case 'loaded':
      if (state.workouts.length === 0) {
        return <p className="text-muted-foreground">No workouts yet</p>
      }
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Date</TableHead>
              <TableHead scope="col">Kind</TableHead>
              <TableHead scope="col">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>
                  <time dateTime={workout.performedOn}>{workout.performedOn}</time>
                </TableCell>
                <TableCell className="capitalize">{workout.kind}</TableCell>
                {/* whitespace-normal: notes are free text and should wrap, unlike the other cells. */}
                <TableCell className="whitespace-normal">{workout.notes ?? ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    default: {
      const unhandled: never = state
      return unhandled
    }
  }
}

export default WorkoutsList
