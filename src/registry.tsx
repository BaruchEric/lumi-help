import { type ReactNode, createContext, useContext, useMemo } from 'react'
import type { GuideEntry, SymbolEntry } from './types'

export interface Registry {
  symbols: SymbolEntry[]
  guides: GuideEntry[]
  getSymbol(id: string): SymbolEntry | undefined
  getGuide(id: string): GuideEntry | undefined
  search(q: string): Array<SymbolEntry | GuideEntry>
}

export function createRegistry(input: {
  symbols?: SymbolEntry[]
  guides?: GuideEntry[]
}): Registry {
  const symbols = input.symbols ?? []
  const guides = input.guides ?? []
  const symbolById = new Map(symbols.map((s) => [s.id, s] as const))
  const guideById = new Map(guides.map((g) => [g.id, g] as const))

  const matchesSymbol = (s: SymbolEntry, query: string) =>
    s.label.toLowerCase().includes(query) ||
    s.id.toLowerCase().includes(query) ||
    (s.aliases ?? []).some((a) => a.toLowerCase().includes(query))
  const matchesGuide = (g: GuideEntry, query: string) =>
    g.title.toLowerCase().includes(query) ||
    g.summary.toLowerCase().includes(query) ||
    (g.aliases ?? []).some((a) => a.toLowerCase().includes(query))

  return {
    symbols,
    guides,
    getSymbol: (id) => symbolById.get(id),
    getGuide: (id) => guideById.get(id),
    search(q) {
      const query = q.trim().toLowerCase()
      if (!query) return []
      return [
        ...symbols.filter((s) => matchesSymbol(s, query)),
        ...guides.filter((g) => matchesGuide(g, query)),
      ]
    },
  }
}

const EMPTY_REGISTRY: Registry = createRegistry({})
const RegistryContext = createContext<Registry>(EMPTY_REGISTRY)

export function RegistryProvider({
  registry,
  children,
}: {
  registry: Registry
  children: ReactNode
}) {
  const value = useMemo(() => registry, [registry])
  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>
}

export function useRegistry(): Registry {
  return useContext(RegistryContext)
}
