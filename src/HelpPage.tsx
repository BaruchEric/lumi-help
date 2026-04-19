import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { AskLumi, type AskLumiProps } from './AskLumi'
import { useLearnMode } from './LearnMode'
import { useRegistry } from './registry'
import type { GuideEntry, SectionDef, SymbolEntry } from './types'

export interface HelpPageProps {
  /** Title shown in the hero. Defaults to "Help & Guide". */
  title?: string
  /** Subtitle copy. */
  subtitle?: string
  /** Ordered list of sections to render. Defaults: derived from registry. */
  sections?: SectionDef[]
  /** Enable the Ask AI search at the top. Off by default. */
  ask?: AskLumiProps | false
}

function deriveSections(symbols: SymbolEntry[], guides: GuideEntry[]): SectionDef[] {
  const seen = new Set<string>()
  const order: string[] = []
  for (const s of symbols)
    if (!seen.has(s.section)) {
      seen.add(s.section)
      order.push(s.section)
    }
  for (const g of guides)
    if (!seen.has(g.section)) {
      seen.add(g.section)
      order.push(g.section)
    }
  return order.map((id) => ({ id, label: id }))
}

function readHash(): string {
  if (typeof window === 'undefined') return ''
  return window.location.hash
}

function useHashFragment(): string {
  const [hash, setHash] = useState(readHash)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export function HelpPage({
  title = 'Help & Guide',
  subtitle,
  sections,
  ask = false,
}: HelpPageProps = {}) {
  const registry = useRegistry()
  const hash = useHashFragment()
  const { reset } = useLearnMode()
  const [query, setQuery] = useState('')
  const [flashId, setFlashId] = useState<string | null>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  const sectionList = useMemo(
    () => sections ?? deriveSections(registry.symbols, registry.guides),
    [sections, registry.symbols, registry.guides],
  )

  useEffect(() => {
    if (!hash) return
    const m = /^#(symbol|guide)=(.+)$/.exec(hash)
    if (!m || !m[2]) return
    const targetId = m[2]
    const el = refs.current[targetId]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setFlashId(targetId)
    const t = setTimeout(() => setFlashId(null), 1200)
    return () => clearTimeout(t)
  }, [hash])

  const bySection = useMemo(() => {
    const q = query.trim()
    const hits = q ? new Set(registry.search(q).map((h) => h.id)) : null
    const filteredSyms = hits ? registry.symbols.filter((s) => hits.has(s.id)) : registry.symbols
    const filteredGuides = hits ? registry.guides.filter((g) => hits.has(g.id)) : registry.guides
    const grouped = new Map<string, { symbols: SymbolEntry[]; guides: GuideEntry[] }>()
    for (const sec of sectionList) grouped.set(sec.id, { symbols: [], guides: [] })
    for (const s of filteredSyms) {
      if (!grouped.has(s.section)) grouped.set(s.section, { symbols: [], guides: [] })
      grouped.get(s.section)?.symbols.push(s)
    }
    for (const g of filteredGuides) {
      if (!grouped.has(g.section)) grouped.set(g.section, { symbols: [], guides: [] })
      grouped.get(g.section)?.guides.push(g)
    }
    return grouped
  }, [query, registry, sectionList])

  return (
    <main className="help-page">
      <header className="help-page__hero">
        <h1>{title}</h1>
        {subtitle && <p className="help-page__subtitle">{subtitle}</p>}
        {ask && <AskLumi {...ask} />}
        <div className="help-page__chips">
          {sectionList.map((s) => (
            <a key={s.id} href={`#section-${s.id}`} className="help-page__chip">
              {s.label}
            </a>
          ))}
        </div>
        <div className="help-page__filter">
          <input
            type="search"
            placeholder="Quick keyword filter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Filter symbols and guides"
          />
        </div>
      </header>

      {sectionList.map((sec) => {
        const entry = bySection.get(sec.id) ?? { symbols: [], guides: [] }
        if (entry.symbols.length === 0 && entry.guides.length === 0) return null
        return (
          <section key={sec.id} id={`section-${sec.id}`} className="help-section">
            <h2>{sec.label}</h2>

            {entry.guides.length > 0 && (
              <div className="help-section__guides">
                {entry.guides.map((g) => (
                  <GuideCard
                    key={g.id}
                    guide={g}
                    flash={flashId === g.id}
                    setRef={(el) => {
                      refs.current[g.id] = el
                    }}
                  />
                ))}
              </div>
            )}

            {entry.symbols.length > 0 && (
              <ul className="help-section__symbols">
                {entry.symbols.map((s) => (
                  <SymbolRow
                    key={s.id}
                    sym={s}
                    flash={flashId === s.id}
                    setRef={(el) => {
                      refs.current[s.id] = el
                    }}
                  />
                ))}
              </ul>
            )}
          </section>
        )
      })}

      <footer className="help-page__footer">
        <button type="button" onClick={reset}>
          Reset my learning
        </button>
      </footer>
    </main>
  )
}

function SymbolRow({
  sym,
  flash,
  setRef,
}: {
  sym: SymbolEntry
  flash: boolean
  setRef: (el: HTMLElement | null) => void
}) {
  const Icon = sym.icon
  return (
    <li ref={setRef} className={`symbol-row${flash ? ' symbol-row--flash' : ''}`}>
      <span className="symbol-row__icon">{Icon ? <Icon size={18} /> : null}</span>
      <span className="symbol-row__label">{sym.label}</span>
      {sym.meaning && <span className="symbol-row__meaning">{sym.meaning}</span>}
      {sym.learnMoreGuideId && (
        <a href={`#guide=${sym.learnMoreGuideId}`} className="symbol-row__more">
          Learn more →
        </a>
      )}
    </li>
  )
}

function GuideCard({
  guide,
  flash,
  setRef,
}: {
  guide: GuideEntry
  flash: boolean
  setRef: (el: HTMLElement | null) => void
}) {
  return (
    <article ref={setRef} className={`guide-card${flash ? ' guide-card--flash' : ''}`}>
      <h3>{guide.title}</h3>
      <p className="guide-card__summary">{guide.summary}</p>
      <details>
        <summary>Read full guide</summary>
        <div className="guide-card__body">
          <ReactMarkdown>{guide.body}</ReactMarkdown>
        </div>
      </details>
    </article>
  )
}
