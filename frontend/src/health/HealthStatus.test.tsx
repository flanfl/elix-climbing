import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HealthStatus from './HealthStatus'
import { fetchHealth } from './healthApi'

// The component is tested against a fake client; the client has its own tests.
vi.mock('./healthApi')

describe('HealthStatus', () => {
  beforeEach(() => {
    vi.mocked(fetchHealth).mockReset()
  })

  it('shows a waiting message until the API has answered', () => {
    vi.mocked(fetchHealth).mockReturnValue(new Promise(() => {}))

    renderWithProviders(<HealthStatus />)

    expect(screen.getByRole('status')).toHaveTextContent('Checking the API')
  })

  it('shows ok when the API is healthy', async () => {
    vi.mocked(fetchHealth).mockResolvedValue({ status: 'ok', checks: { database: 'up' } })

    renderWithProviders(<HealthStatus />)

    expect(await screen.findByText('API ok')).toBeInTheDocument()
  })

  it('names the failing check when the API is degraded', async () => {
    vi.mocked(fetchHealth).mockResolvedValue({
      status: 'degraded',
      checks: { database: 'down' },
    })

    renderWithProviders(<HealthStatus />)

    expect(await screen.findByText('API degraded: database down')).toBeInTheDocument()
  })

  it('says the API is unreachable when the request fails', async () => {
    vi.mocked(fetchHealth).mockRejectedValue(new TypeError('Failed to fetch'))

    renderWithProviders(<HealthStatus />)

    expect(await screen.findByRole('alert')).toHaveTextContent('API unreachable')
  })
})
