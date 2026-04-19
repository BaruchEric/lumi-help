import type { AiTransport } from './adapters/transport'
import type { Registry } from './registry'

export interface LumiParsed {
  text: string
  citations: string[]
}

export interface AskLumiOptions {
  /** Short first-person intro. Default is product-neutral. */
  persona?: string
  /** Max response length hint passed to the LLM. Default 120 words. */
  maxWords?: number
}

const DEFAULT_PERSONA = 'You are a friendly in-app help assistant.'

export function buildGroundingPrompt(
  question: string,
  registry: Registry,
  opts: AskLumiOptions = {},
): string {
  const persona = opts.persona ?? DEFAULT_PERSONA
  const maxWords = opts.maxWords ?? 120
  const symbolLines = registry.symbols
    .map((s) => `- ${s.id} (${s.section}): ${s.label}${s.meaning ? ` — ${s.meaning}` : ''}`)
    .join('\n')
  const guideLines = registry.guides
    .map((g) => `- ${g.id} (${g.section}): ${g.title} — ${g.summary}`)
    .join('\n')
  const corpus = `SYMBOLS:\n${symbolLines}\n\nGUIDES:\n${guideLines}`
  return [
    persona,
    'Answer ONLY from the symbols and guides listed below. If the answer is not in the corpus, say "I\'m not sure — here are the closest entries I found" and list the most relevant IDs.',
    `When you reference a symbol or guide, cite it using the marker [[id]] inline. Keep answers under ${maxWords} words. Be warm and plain-spoken.`,
    '',
    corpus,
    '',
    `USER QUESTION: ${question}`,
  ].join('\n')
}

const CITATION_RE = /\s*\[\[([^\]]+)\]\]/g

export function parseLumiResponse(raw: string): LumiParsed {
  const citations: string[] = []
  const text = raw
    .replace(CITATION_RE, (_m, id) => {
      citations.push(String(id).trim())
      return ''
    })
    .trim()
  return { text, citations }
}

export async function askLumi(
  question: string,
  registry: Registry,
  transport: AiTransport,
  opts?: AskLumiOptions,
): Promise<LumiParsed> {
  const prompt = buildGroundingPrompt(question, registry, opts)
  const raw = await transport(prompt)
  return parseLumiResponse(raw)
}
