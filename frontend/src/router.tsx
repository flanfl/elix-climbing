import type { QueryClient } from '@tanstack/react-query'
import { createRouter, type RouterHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// A factory rather than one shared router: main.tsx builds the app's router, and tests build a
// fresh one per test with an in-memory history, the same way they get a fresh QueryClient.
export function createAppRouter(queryClient: QueryClient, history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    // Handed to every route's loader, so loaders can fill the Query cache before a page shows.
    context: { queryClient },
    // Start loading a page's data when the user hovers or focuses its link.
    defaultPreload: 'intent',
    // Query owns the cache and decides when data is stale; the router must not keep its own copy.
    defaultPreloadStaleTime: 0,
  })
}

// Teaches TypeScript about this app's routes: <Link to>, useParams and navigate are then checked
// against the real route tree, and a link to a path that does not exist fails to compile.
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
