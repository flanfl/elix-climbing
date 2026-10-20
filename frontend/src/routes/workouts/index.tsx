import { createFileRoute } from '@tanstack/react-router'
import WorkoutsList from '@/training/workouts/WorkoutsList'
import { workoutsQuery } from '@/training/workouts/workoutsQueries'

export const Route = createFileRoute('/workouts/')({
  // Starts the request as soon as navigation (or hovering a link to here) begins, so the data is
  // often cached by the time WorkoutsList renders. Deliberately NOT awaited: awaiting would hold
  // the whole page, shell included, until the API answers; WorkoutsList shows its own loading
  // and error states instead. prefetchQuery never throws, so there is no rejection to handle.
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(workoutsQuery)
  },
  component: WorkoutsList,
})
