import { Link, Outlet } from '@tanstack/react-router'
import HealthStatus from '@/health/HealthStatus'

// The frame around every page: the current page renders in place of <Outlet />.
function AppShell() {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col px-4">
      <header className="flex items-center justify-between gap-6 border-b py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold tracking-tight">elix-climbing</h1>
          <nav aria-label="Main">
            {/* activeProps applies when the current URL is under this link's path. */}
            <Link
              to="/workouts"
              className="text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: 'text-foreground font-medium' }}
            >
              Workouts
            </Link>
          </nav>
        </div>
        <HealthStatus />
      </header>
      <main className="py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
