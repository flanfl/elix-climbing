import { createFileRoute, redirect } from '@tanstack/react-router'

// No home page yet: send `/` to the workouts. Replace with a real page when there is one.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/workouts' })
  },
})
