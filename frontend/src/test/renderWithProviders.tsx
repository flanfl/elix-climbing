import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createAppRouter } from '@/router'

// A new client per test: a shared one would carry cached data from one test into the next.
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // Query retries a failed request 3 times by default, with a growing delay: an error test
      // would wait several seconds before the error shows. Tests want the failure at once.
      queries: { retry: false },
    },
  })
}

// Renders a single component inside the providers it needs, so components that call useQuery
// work in tests. For anything that depends on the URL (links, redirects, the shell), use
// renderRoute instead.
export function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

// Renders the whole app, routes and shell included, as if the browser had opened `path`. The
// history lives in memory: tests never touch jsdom's address bar, so they cannot leak a URL.
// Routing is asynchronous: query the result with findBy*, not getBy*.
export function renderRoute(path: string) {
  const queryClient = createTestQueryClient()
  const router = createAppRouter(queryClient, createMemoryHistory({ initialEntries: [path] }))
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { ...result, router }
}
