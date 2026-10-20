import { queryOptions } from '@tanstack/react-query'
import { fetchWorkouts } from './workoutsApi'

// The cache key and the fetcher, defined once. Components pass this to useQuery; route loaders
// will pass it to queryClient.ensureQueryData, and both then share the same cache entry.
// Kept out of workoutsApi.ts so tests can mock the HTTP calls without mocking this object.
export const workoutsQuery = queryOptions({
  queryKey: ['workouts'],
  // Query hands over an AbortSignal and aborts it when no component needs the result anymore.
  queryFn: ({ signal }) => fetchWorkouts(signal),
})
