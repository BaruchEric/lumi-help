import * as Tooltip from '@radix-ui/react-tooltip'
import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useState,
} from 'react'
import { useLearnMode } from './LearnMode'
import { useRegistry } from './registry'
import { useTouchHold } from './useTouchHold'

type Side = 'top' | 'right' | 'bottom' | 'left'

interface Props {
  id?: string
  children: ReactNode
  side?: Side
  /** Override the default learn-more href builder. Receives the guide id or,
   *  when no guide is linked, the symbol id prefixed with `symbol=`. */
  buildHref?: (target: { kind: 'guide' | 'symbol'; id: string }) => string
}

const defaultBuildHref = (t: { kind: 'guide' | 'symbol'; id: string }) =>
  t.kind === 'guide' ? `#guide=${t.id}` : `#symbol=${t.id}`

export function SymbolTip({ id, children, side = 'top', buildHref }: Props) {
  if (!id) return <>{children}</>
  return (
    <SymbolTipInner id={id} side={side} buildHref={buildHref}>
      {children}
    </SymbolTipInner>
  )
}

function SymbolTipInner({
  id,
  children,
  side = 'top',
  buildHref,
}: {
  id: string
  children: ReactNode
  side?: Side
  buildHref?: Props['buildHref']
}) {
  const registry = useRegistry()
  const entry = registry.getSymbol(id)
  const [open, setOpen] = useState(false)
  const learn = useLearnMode()
  const state = learn.getState(id)
  const handleHold = useCallback(() => {
    setOpen(true)
    learn.track(id)
  }, [id, learn])
  const longPress = useTouchHold(handleHold, { ms: 500 })

  if (!entry) return <>{children}</>

  const wrapClasses = [
    'symbol-tip-wrap',
    learn.enabled && state === 'unseen' ? 'symbol-tip-wrap--unseen' : '',
    learn.enabled && state === 'exploring' ? 'symbol-tip-wrap--exploring' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const triggerChildren = isValidElement(children) ? (
    cloneElement(children as ReactElement<Record<string, unknown>>, {
      ...longPress,
      'data-symbol-id': id,
    })
  ) : (
    <span {...longPress} data-symbol-id={id}>
      {children}
    </span>
  )

  const href = entry.learnMoreGuideId
    ? (buildHref ?? defaultBuildHref)({ kind: 'guide', id: entry.learnMoreGuideId })
    : (buildHref ?? defaultBuildHref)({ kind: 'symbol', id: entry.id })

  const ariaLabel = entry.meaning ? `${entry.label}: ${entry.meaning}` : entry.label

  return (
    <Tooltip.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (v) learn.track(id)
      }}
    >
      <Tooltip.Trigger asChild>
        <span className={wrapClasses}>
          {triggerChildren}
          {learn.enabled && state === 'unseen' && (
            <span className="symbol-tip-pill">{entry.label}</span>
          )}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={6}
          collisionPadding={12}
          className="symbol-tip"
          aria-label={ariaLabel}
        >
          <div className="symbol-tip__label">{entry.label}</div>
          {entry.meaning && <div className="symbol-tip__meaning">{entry.meaning}</div>}
          {entry.learnMoreGuideId && (
            <a href={href} className="symbol-tip__more" onClick={() => setOpen(false)}>
              Learn more →
            </a>
          )}
          <Tooltip.Arrow className="symbol-tip__arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
