import type { HelpProgressDoc, SymbolHistoryEntry, SymbolProgressState } from './types'

export function computeState(entry: SymbolHistoryEntry | undefined): SymbolProgressState {
  if (!entry || entry.views === 0) return 'unseen'
  if (entry.dismissed || entry.views >= 3) return 'mastered'
  return 'exploring'
}

export function mergeInteraction(
  prev: SymbolHistoryEntry | undefined,
  now: number,
): SymbolHistoryEntry {
  if (!prev) return { views: 1, lastSeen: now }
  return { ...prev, views: prev.views + 1, lastSeen: now }
}

export function blankDoc(uid: string): HelpProgressDoc {
  return {
    uid,
    symbolHistory: {},
    learnMode: { enabled: false },
    updatedAt: 0,
  }
}
