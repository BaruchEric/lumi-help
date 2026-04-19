import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTouchHold } from '../useTouchHold'

function Host({ cb, ms }: { cb: () => void; ms?: number }) {
  const h = useTouchHold(cb, { ms })
  return <button type="button" data-testid="btn" {...h} />
}

describe('useTouchHold', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('fires after the hold window elapses', () => {
    const cb = vi.fn()
    const { getByTestId } = render(<Host cb={cb} ms={300} />)
    const btn = getByTestId('btn')
    fireEvent.touchStart(btn, { touches: [{ clientX: 0, clientY: 0 }] })
    expect(cb).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('cancels on touchend before the hold fires', () => {
    const cb = vi.fn()
    const { getByTestId } = render(<Host cb={cb} ms={300} />)
    const btn = getByTestId('btn')
    fireEvent.touchStart(btn, { touches: [{ clientX: 0, clientY: 0 }] })
    fireEvent.touchEnd(btn)
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(cb).not.toHaveBeenCalled()
  })

  it('cancels if the touch moves past the threshold', () => {
    const cb = vi.fn()
    const { getByTestId } = render(<Host cb={cb} ms={300} />)
    const btn = getByTestId('btn')
    fireEvent.touchStart(btn, { touches: [{ clientX: 0, clientY: 0 }] })
    fireEvent.touchMove(btn, { touches: [{ clientX: 50, clientY: 50 }] })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(cb).not.toHaveBeenCalled()
  })
})
