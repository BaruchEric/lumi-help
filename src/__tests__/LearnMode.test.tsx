import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LearnModeProvider, LearnModeToggle, useLearnMode } from '../LearnMode'
import { memoryAdapter } from '../adapters/storage'

function Probe() {
  const { enabled } = useLearnMode()
  return <span data-testid="state">{enabled ? 'on' : 'off'}</span>
}

describe('LearnModeProvider', () => {
  it('starts disabled and toggles via the toggle button', async () => {
    render(
      <LearnModeProvider adapter={memoryAdapter()} showBanner={false}>
        <LearnModeToggle />
        <Probe />
      </LearnModeProvider>,
    )
    expect(screen.getByTestId('state').textContent).toBe('off')

    const button = screen.getByRole('button', { name: /turn on learn mode/i })
    await act(async () => {
      button.click()
    })
    expect(screen.getByTestId('state').textContent).toBe('on')
  })

  it('returns a no-op context outside a provider', () => {
    render(<Probe />)
    expect(screen.getByTestId('state').textContent).toBe('off')
  })
})
