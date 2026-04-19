import { useCallback, useEffect, useRef, useState } from 'react'
import type { HelpProgressAdapter } from './adapters/storage'
import { blankDoc, mergeInteraction } from './helpProgress'
import type { HelpProgressDoc } from './types'

const SAVE_DEBOUNCE_MS = 500

export interface UseHelpProgressOptions {
  adapter: HelpProgressAdapter
  uid?: string
  debounceMs?: number
}

export function useHelpProgress({
  adapter,
  uid = 'anonymous',
  debounceMs = SAVE_DEBOUNCE_MS,
}: UseHelpProgressOptions) {
  const [doc, setDoc] = useState<HelpProgressDoc>(() => blankDoc(uid))
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.resolve(adapter.load()).then((loaded) => {
      if (cancelled || !loaded) return
      setDoc({ ...blankDoc(uid), ...loaded, uid })
    })
    return () => {
      cancelled = true
    }
  }, [adapter, uid])

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    },
    [],
  )

  const persist = useCallback(
    (next: HelpProgressDoc) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        Promise.resolve(adapter.save(next)).catch(() => {
          /* best-effort; next interaction retries */
        })
      }, debounceMs)
    },
    [adapter, debounceMs],
  )

  const update = useCallback(
    (fn: (prev: HelpProgressDoc) => HelpProgressDoc) => {
      setDoc((prev) => {
        const next = fn(prev)
        if (next === prev) return prev
        const withMeta = { ...next, updatedAt: Date.now() }
        persist(withMeta)
        return withMeta
      })
    },
    [persist],
  )

  const trackInteraction = useCallback(
    (symbolId: string) =>
      update((prev) => ({
        ...prev,
        symbolHistory: {
          ...prev.symbolHistory,
          [symbolId]: mergeInteraction(prev.symbolHistory[symbolId], Date.now()),
        },
      })),
    [update],
  )

  const setLearnMode = useCallback(
    (enabled: boolean) =>
      update((prev) =>
        prev.learnMode.enabled === enabled ? prev : { ...prev, learnMode: { enabled } },
      ),
    [update],
  )

  const resetLearning = useCallback(
    () =>
      update((prev) =>
        Object.keys(prev.symbolHistory).length === 0 ? prev : { ...prev, symbolHistory: {} },
      ),
    [update],
  )

  return { doc, trackInteraction, setLearnMode, resetLearning }
}
