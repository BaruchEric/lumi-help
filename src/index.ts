export type {
  GuideEntry,
  HelpProgressDoc,
  IconComponent,
  SectionDef,
  SymbolEntry,
  SymbolHistoryEntry,
  SymbolProgressState,
} from './types'

export { createRegistry, RegistryProvider, useRegistry, type Registry } from './registry'

export { SymbolTip } from './SymbolTip'
export { LearnModeProvider, LearnModeToggle, useLearnMode } from './LearnMode'
export type { LearnModeProviderProps } from './LearnMode'
export { HelpPage } from './HelpPage'
export type { HelpPageProps } from './HelpPage'
export { AskLumi } from './AskLumi'
export type { AskLumiProps } from './AskLumi'

export { useHelpProgress } from './useHelpProgress'
export type { UseHelpProgressOptions } from './useHelpProgress'
export { useTouchHold } from './useTouchHold'

export { blankDoc, computeState, mergeInteraction } from './helpProgress'
export {
  askLumi,
  buildGroundingPrompt,
  parseLumiResponse,
  type AskLumiOptions,
  type LumiParsed,
} from './lumiPrompt'

export type { HelpProgressAdapter } from './adapters/storage'
export { createLocalStorageAdapter, memoryAdapter } from './adapters/storage'
export type { AiTransport } from './adapters/transport'
export { noopTransport } from './adapters/transport'
