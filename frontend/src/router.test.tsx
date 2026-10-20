import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderRoute } from '@/test/renderWithProviders'

// These tests are about routing and the shell, not the API: keep every request pending so no
// real network call is attempted.
vi.mock('./health/healthApi', () => ({
  fetchHealth: vi.fn(() => new Promise(() => {})),
}))
vi.mock('./training/workouts/workoutsApi', () => ({
  fetchWorkouts: vi.fn(() => new Promise(() => {})),
}))

describe('app routes', () => {
  it('shows the application name as the page heading', async () => {
    renderRoute('/workouts')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'elix-climbing' }),
    ).toBeInTheDocument()
  })

  it('shows the API status in the shell', async () => {
    renderRoute('/workouts')

    expect(await screen.findByText('Checking the API…')).toBeInTheDocument()
  })

  it('links to the workouts from the main navigation', async () => {
    renderRoute('/workouts')

    const nav = await screen.findByRole('navigation', { name: 'Main' })
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Workouts' }))
    expect(screen.getByRole('link', { name: 'Workouts' })).toHaveAttribute('href', '/workouts')
  })

  it('shows the workouts page at /workouts', async () => {
    renderRoute('/workouts')

    expect(await screen.findByRole('heading', { level: 2, name: 'Workouts' })).toBeInTheDocument()
  })

  it('redirects / to the workouts page', async () => {
    const { router } = renderRoute('/')

    expect(await screen.findByRole('heading', { level: 2, name: 'Workouts' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/workouts')
  })
})
