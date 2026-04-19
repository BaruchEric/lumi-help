import * as Tooltip from '@radix-ui/react-tooltip'
import { type ReactNode, createContext, useContext, useEffect, useMemo } from 'react'
import { type HelpProgressAdapter, createLocalStorageAdapter } from './adapters/storage'
import { computeState } from './helpProgress'
import type { SymbolProgressState } from './types'
import { useHelpProgress } from './useHelpProgress'

interface LearnModeCtx {
  enabled: boolean
  toggle: () => void
  getState: (symbolId: string) => SymbolProgressState
  track: (symbolId: string) => void
  reset: () => void
}

const Ctx = createContext<LearnModeCtx | null>(null)
const EMPTY_HISTORY: Record<string, never> = Object.freeze({})
const NOOP_CTX: LearnModeCtx = {
  enabled: false,
  toggle: () => {},
  getState: () => 'mastered',
  track: () => {},
  reset: () => {},
}

export interface LearnModeProviderProps {
  children: ReactNode
  /** Storage for progress. Defaults to localStorage. */
  adapter?: HelpProgressAdapter
  /** User id for multi-user scenarios. Optional — defaults to "anonymous". */
  uid?: string
  /** Banner copy. Defaults to a product-neutral blurb. */
  bannerText?: string
  /** Disable the top banner when Learn Mode is on. */
  showBanner?: boolean
}

export function LearnModeProvider({
  children,
  adapter,
  uid,
  bannerText,
  showBanner = true,
}: LearnModeProviderProps) {
  const stableAdapter = useMemo(() => adapter ?? createLocalStorageAdapter(), [adapter])
  const { doc, trackInteraction, setLearnMode, resetLearning } = useHelpProgress({
    adapter: stableAdapter,
    uid,
  })
  const enabled = doc.learnMode.enabled

  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLearnMode(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, setLearnMode])

  const symbolHistory = enabled ? doc.symbolHistory : EMPTY_HISTORY
  const value = useMemo<LearnModeCtx>(
    () => ({
      enabled,
      toggle: () => setLearnMode(!enabled),
      getState: enabled ? (id) => computeState(symbolHistory[id]) : () => 'mastered',
      track: trackInteraction,
      reset: resetLearning,
    }),
    [enabled, symbolHistory, setLearnMode, trackInteraction, resetLearning],
  )

  return (
    <Ctx.Provider value={value}>
      <Tooltip.Provider delayDuration={180}>
        {enabled && showBanner && (
          <LearnModeBanner text={bannerText} onDismiss={() => setLearnMode(false)} />
        )}
        {children}
      </Tooltip.Provider>
    </Ctx.Provider>
  )
}

export function useLearnMode(): LearnModeCtx {
  return useContext(Ctx) ?? NOOP_CTX
}

function LightbulbIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

export function LearnModeToggle() {
  const { enabled, toggle } = useLearnMode()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn off Learn Mode' : 'Turn on Learn Mode'}
      title="Learn Mode — highlight symbols"
      className={`learn-mode-toggle${enabled ? ' learn-mode-toggle--on' : ''}`}
    >
      <LightbulbIcon />
    </button>
  )
}

const DEFAULT_BANNER = 'Learn Mode on — hover or tap highlighted symbols to learn more.'

function LearnModeBanner({
  text,
  onDismiss,
}: {
  text?: string
  onDismiss: () => void
}) {
  return (
    <output className="learn-mode-banner" aria-live="polite">
      <span>{text ?? DEFAULT_BANNER}</span>
      <button type="button" onClick={onDismiss}>
        Turn off
      </button>
    </output>
  )
}
