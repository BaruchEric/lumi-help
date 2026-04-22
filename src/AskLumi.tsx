import { type FormEvent, useState } from 'react'
import { type AiTransport, noopTransport } from './adapters/transport'
import { type BuildHelpHref, defaultBuildHref } from './href'
import { type AskLumiOptions, askLumi, type LumiParsed } from './lumiPrompt'
import { useRegistry } from './registry'

export interface AskLumiProps {
  transport?: AiTransport
  options?: AskLumiOptions
  placeholder?: string
  /** Override the default chip href builder. */
  buildHref?: BuildHelpHref
}

export function AskLumi({
  transport = noopTransport,
  options,
  placeholder = 'Ask a question…',
  buildHref = defaultBuildHref,
}: AskLumiProps) {
  const registry = useRegistry()
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const [answer, setAnswer] = useState<LumiParsed | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!q.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const parsed = await askLumi(q.trim(), registry, transport, options)
      setAnswer(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ask-lumi">
      <form onSubmit={submit} className="ask-lumi__form">
        <SearchIcon />
        <input
          className="ask-lumi__input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label="Ask"
        />
        {busy && <SpinnerIcon />}
      </form>
      {error && <div className="ask-lumi__error">{error}</div>}
      {answer && (
        <div className="ask-lumi__answer">
          <p>{answer.text}</p>
          {answer.citations.length > 0 && (
            <div className="ask-lumi__chips">
              {answer.citations.map((id) => {
                const sym = registry.getSymbol(id)
                const guide = sym ? undefined : registry.getGuide(id)
                const label = sym?.label ?? guide?.title ?? id
                const href = buildHref({
                  kind: sym ? 'symbol' : 'guide',
                  id,
                })
                return (
                  <a key={id} href={href} className="ask-lumi__chip">
                    {label}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ask-lumi__icon"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ask-lumi__spin"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </svg>
  )
}
