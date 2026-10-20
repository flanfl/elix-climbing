import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import AppShell from '@/layout/AppShell'

// The context type declares what createAppRouter must provide to every loader.
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: AppShell,
})
