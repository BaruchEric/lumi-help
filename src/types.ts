import type { ComponentType, ReactNode } from 'react'

export type IconComponent = ComponentType<{ size?: number | string; className?: string }>

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
