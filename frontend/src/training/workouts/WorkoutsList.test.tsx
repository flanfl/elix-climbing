import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WorkoutsList from './WorkoutsList'
import { fetchWorkouts } from './workoutsApi'

vi.mock('./workoutsApi')

describe('WorkoutsList', () => {
  beforeEach(() => {
    vi.mocked(fetchWorkouts).mockReset()
  })

  it('shows a waiting message until the API has answered', () => {
    vi.mocked(fetchWorkouts).mockReturnValue(new Promise(() => {}))

    renderWithProviders(<WorkoutsList />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading workouts')
  })

  it('shows one row per workout', async () => {
    vi.mocked(fetchWorkouts).mockResolvedValue([
      { id: '1', performedOn: '2026-10-18', kind: 'bouldering', notes: 'Projected the red V5' },
      { id: '2', performedOn: '2026-10-19', kind: 'hangboard', notes: null },
    ])

    renderWithProviders(<WorkoutsList />)

    const rows = within(await screen.findByRole('table')).getAllByRole('row')
    // The first row is the header.
    expect(rows).toHaveLength(3)
    expect(rows[1]).toHaveTextContent('2026-10-18boulderingProjected the red V5')
    expect(rows[2]).toHaveTextContent('2026-10-19hangboard')
  })

  it('says so when there are no workouts', async () => {
    vi.mocked(fetchWorkouts).mockResolvedValue([])

    renderWithProviders(<WorkoutsList />)

    expect(await screen.findByText('No workouts yet')).toBeInTheDocument()
  })

  it('reports a failure to load', async () => {
    vi.mocked(fetchWorkouts).mockRejectedValue(new TypeError('Failed to fetch'))

    renderWithProviders(<WorkoutsList />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load workouts')
  })
})
