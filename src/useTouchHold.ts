import type React from 'react'
import { useCallback, useEffect, useRef } from 'react'

interface Opts {
  ms?: number
  moveThresholdPx?: number
}

export function useTouchHold(onLongPress: () => void, opts: Opts = {}) {
  const { ms = 500, moveThresholdPx = 10 } = opts
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const start = useRef<{ x: number; y: number } | null>(null)

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    start.current = null
  }, [])

  useEffect(() => () => clear(), [clear])

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      start.current = { x: t.clientX, y: t.clientY }
      timer.current = setTimeout(() => {
        onLongPress()
        timer.current = null
      }, ms)
    },
    [ms, onLongPress],
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!start.current) return
      const t = e.touches[0]
      if (!t) return
      const dx = t.clientX - start.current.x
      const dy = t.clientY - start.current.y
      if (Math.hypot(dx, dy) > moveThresholdPx) clear()
    },
    [clear, moveThresholdPx],
  )

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd: clear,
    onTouchCancel: clear,
  }
}
