import * as Tooltip from '@radix-ui/react-tooltip'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createRegistry, RegistryProvider } from '../registry'
import { SymbolTip } from '../SymbolTip'

const registry = createRegistry({
  symbols: [
    {
      id: 'sharing.private',
      label: 'Private',
      section: 'sharing',
      meaning: 'Only you can see this.',
      learnMoreGuideId: 'sharing-guide',
    },
  ],
})

function renderWithProviders(ui: ReactNode) {
  return render(
    <RegistryProvider registry={registry}>
      <Tooltip.Provider>{ui}</Tooltip.Provider>
    </RegistryProvider>,
  )
}

describe('SymbolTip', () => {
  it('renders children untouched when id is unknown', () => {
    renderWithProviders(
      <SymbolTip id="nope">
        <span>raw</span>
      </SymbolTip>,
    )
    expect(screen.getByText('raw')).toBeInTheDocument()
  })

  it('renders children untouched when id is undefined', () => {
    renderWithProviders(
      <SymbolTip>
        <span>raw</span>
      </SymbolTip>,
    )
    expect(screen.getByText('raw')).toBeInTheDocument()
  })

  it('wraps a known symbol with a data-symbol-id marker', () => {
    const { container } = renderWithProviders(
      <SymbolTip id="sharing.private">
        <span>lock</span>
      </SymbolTip>,
    )
    expect(container.querySelector('[data-symbol-id="sharing.private"]')).not.toBeNull()
  })
})
