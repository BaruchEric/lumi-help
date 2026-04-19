import type { ReactNode } from 'react'

// Intentionally loose: icon libraries (lucide-react, heroicons, etc.) return
// ForwardRefExoticComponent, which doesn't unify cleanly with FunctionComponent
// across React type versions. We only use this to render `<Icon size={n} />`,
// so the looseness is benign in practice.
// biome-ignore lint/suspicious/noExplicitAny: cross-icon-lib & cross-React-version compatibility
export type IconComponent = any

export interface SymbolEntry {
  id: string
  label: string
  section: string
  meaning?: string
  details?: string
  learnMoreGuideId?: string
  aliases?: string[]
  icon?: IconComponent
  example?: ReactNode
}

export interface GuideEntry {
  id: string
  title: string
  section: string
  summary: string
  body: string
  relatedSymbols?: string[]
  aliases?: string[]
}

export type SymbolProgressState = 'unseen' | 'exploring' | 'mastered'

export interface SymbolHistoryEntry {
  views: number
  lastSeen: number
  dismissed?: boolean
}

export interface HelpProgressDoc {
  uid: string
  symbolHistory: Record<string, SymbolHistoryEntry>
  learnMode: { enabled: boolean }
  updatedAt: number
}

export interface SectionDef {
  id: string
  label: string
}
