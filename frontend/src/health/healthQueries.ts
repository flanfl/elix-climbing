import { queryOptions } from '@tanstack/react-query'
import { fetchHealth } from './healthApi'

export const healthQuery = queryOptions({
  queryKey: ['health'],
  queryFn: ({ signal }) => fetchHealth(signal),
})
