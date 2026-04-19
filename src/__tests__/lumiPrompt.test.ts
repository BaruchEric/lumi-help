import { describe, expect, it } from 'vitest'
import { askLumi, buildGroundingPrompt, parseLumiResponse } from '../lumiPrompt'
import { createRegistry } from '../registry'

const registry = createRegistry({
  symbols: [{ id: 'sharing.private', label: 'Private', section: 'sharing', meaning: 'Only you.' }],
  guides: [
    {
      id: 'logging-a-meal',
      title: 'Logging a meal',
      section: 'food',
      summary: 'From empty Diary to saved meal.',
      body: '',
    },
  ],
})

describe('buildGroundingPrompt', () => {
  it('embeds the registry corpus and the user question', () => {
    const p = buildGroundingPrompt('How do I log a meal?', registry)
    expect(p).toContain('sharing.private')
    expect(p).toContain('Only you.')
    expect(p).toContain('logging-a-meal')
    expect(p).toContain('USER QUESTION: How do I log a meal?')
  })

  it('honors persona and maxWords overrides', () => {
    const p = buildGroundingPrompt('hi', registry, {
      persona: 'You are Lumi.',
      maxWords: 40,
    })
    expect(p.startsWith('You are Lumi.')).toBe(true)
    expect(p).toContain('under 40 words')
  })
})

describe('parseLumiResponse', () => {
  it('extracts citations and strips markers from the text', () => {
    const { text, citations } = parseLumiResponse(
      'Private means only you [[sharing.private]]. Use Learn Mode [[guide.learn]].',
    )
    expect(text).toBe('Private means only you. Use Learn Mode.')
    expect(citations).toEqual(['sharing.private', 'guide.learn'])
  })

  it('returns empty citations when none present', () => {
    const { text, citations } = parseLumiResponse('Just prose.')
    expect(text).toBe('Just prose.')
    expect(citations).toEqual([])
  })
})

describe('askLumi', () => {
  it('round-trips question through the transport and parses citations', async () => {
    const transport = async (prompt: string) => {
      expect(prompt).toContain('Q?')
      return 'Answer [[sharing.private]] end.'
    }
    const parsed = await askLumi('Q?', registry, transport)
    expect(parsed.text).toBe('Answer end.')
    expect(parsed.citations).toEqual(['sharing.private'])
  })
})
