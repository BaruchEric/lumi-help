export type HelpHrefTarget = { kind: 'symbol' | 'guide'; id: string }
export type BuildHelpHref = (target: HelpHrefTarget) => string

export const defaultBuildHref: BuildHelpHref = (t) =>
  t.kind === 'guide' ? `#guide=${t.id}` : `#symbol=${t.id}`
