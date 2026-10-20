import HealthStatus from './health/HealthStatus'
import WorkoutsList from './training/workouts/WorkoutsList'

function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col px-4">
      <header className="flex items-center justify-between border-b py-4">
        <h1 className="text-xl font-semibold tracking-tight">elix-climbing</h1>
        <HealthStatus />
      </header>
      <main className="py-6">
        <WorkoutsList />
      </main>
    </div>
  )
}

export default App
