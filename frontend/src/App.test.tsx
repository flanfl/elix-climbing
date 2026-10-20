import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

// App is not about the API: keep its request pending so no real network call is attempted.
vi.mock('./health/healthApi', () => ({
  fetchHealth: vi.fn(() => new Promise(() => {})),
}))
vi.mock('./training/workouts/workoutsApi', () => ({
  fetchWorkouts: vi.fn(() => new Promise(() => {})),
}))

describe('App', () => {
  it('shows the application name as the page heading', () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'elix-climbing' })).toBeInTheDocument()
  })

  it('shows the API status', () => {
    renderWithProviders(<App />)

    expect(screen.getByText('Checking the API…')).toBeInTheDocument()
  })

  it('shows the workouts', () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('heading', { level: 2, name: 'Workouts' })).toBeInTheDocument()
  })
})
