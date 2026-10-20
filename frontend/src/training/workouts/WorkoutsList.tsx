import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Workout } from './workoutsApi'
import { workoutsQuery } from './workoutsQueries'

function WorkoutsList() {
  const query = useQuery(workoutsQuery)

  return (
    <section aria-labelledby="workouts-heading" className="space-y-4">
      <h2 id="workouts-heading" className="text-2xl font-semibold tracking-tight">
        Workouts
      </h2>
      <WorkoutsContent query={query} />
    </section>
  )
}

function WorkoutsContent({ query }: { query: UseQueryResult<Workout[]> }) {
  switch (query.status) {
    case 'pending':
      return (
        <p role="status" className="text-muted-foreground">
          Loading workouts…
        </p>
      )
    case 'error':
      return (
        <p role="alert" className="text-destructive">
          Could not load workouts
        </p>
      )
    case 'success':
      if (query.data.length === 0) {
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
            {query.data.map((workout) => (
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
      const unhandled: never = query
      return unhandled
    }
  }
}

export default WorkoutsList
