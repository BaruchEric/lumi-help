import type { HelpProgressDoc } from '../types'

export interface HelpProgressAdapter {
  load(): Promise<HelpProgressDoc | null> | HelpProgressDoc | null
  save(doc: HelpProgressDoc): Promise<void> | void
}

export function createLocalStorageAdapter(storageKey = 'lumi-help.progress'): HelpProgressAdapter {
  const hasStorage = () => typeof localStorage !== 'undefined'
  return {
    load() {
      if (!hasStorage()) return null
      try {
        const raw = localStorage.getItem(storageKey)
        return raw ? (JSON.parse(raw) as HelpProgressDoc) : null
      } catch {
        return null
      }
    },
    save(doc) {
      if (!hasStorage()) return
      try {
        localStorage.setItem(storageKey, JSON.stringify(doc))
      } catch {
        /* quota/private-mode — ignore */
      }
    },
  }
}

export const memoryAdapter = (): HelpProgressAdapter => {
  let state: HelpProgressDoc | null = null
  return {
    load: () => state,
    save: (doc) => {
      state = doc
    },
  }
}
