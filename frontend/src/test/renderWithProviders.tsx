import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'

// Renders `ui` inside the providers the app sets up in main.tsx, so components that call
// useQuery work in tests.
export function renderWithProviders(ui: ReactElement) {
  // A new client per test: a shared one would carry cached data from one test into the next.
  const queryClient = new QueryClient({
    defaultOptions: {
      // Query retries a failed request 3 times by default, with a growing delay: an error test
      // would wait several seconds before the error shows. Tests want the failure at once.
      queries: { retry: false },
    },
  })

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}
