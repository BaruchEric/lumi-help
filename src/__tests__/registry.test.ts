import { describe, expect, it } from 'vitest'
import { createRegistry } from '../registry'
import type { GuideEntry, SymbolEntry } from '../types'

const symbols: SymbolEntry[] = [
  { id: 'sharing.private', label: 'Private', section: 'sharing', aliases: ['personal'] },
  { id: 'nutrient.carbs', label: 'Carbohydrates', section: 'food', aliases: ['sugar'] },
]
const guides: GuideEntry[] = [
  {
    id: 'logging-a-meal',
    title: 'Logging a meal',
    section: 'food',
    summary: 'From empty Diary to saved meal.',
    body: '…',
    aliases: ['log'],
  },
]

describe('createRegistry', () => {
  it('looks up symbols and guides by id', () => {
    const r = createRegistry({ symbols, guides })
    expect(r.getSymbol('sharing.private')?.label).toBe('Private')
    expect(r.getGuide('logging-a-meal')?.title).toBe('Logging a meal')
    expect(r.getSymbol('missing')).toBeUndefined()
  })

  it('searches across label, id, summary, and aliases', () => {
    const r = createRegistry({ symbols, guides })
    expect(r.search('private').map((x) => x.id)).toEqual(['sharing.private'])
    expect(r.search('sugar').map((x) => x.id)).toEqual(['nutrient.carbs'])
    expect(r.search('meal').map((x) => x.id)).toEqual(['logging-a-meal'])
    expect(r.search('diary').map((x) => x.id)).toEqual(['logging-a-meal'])
  })

  it('returns empty on blank query', () => {
    const r = createRegistry({ symbols, guides })
    expect(r.search('')).toEqual([])
    expect(r.search('   ')).toEqual([])
  })

  it('is case-insensitive', () => {
    const r = createRegistry({ symbols, guides })
    expect(r.search('CARBS').map((x) => x.id)).toEqual(['nutrient.carbs'])
  })

  it('returns identity arrays', () => {
    const r = createRegistry({ symbols, guides })
    expect(r.symbols).toBe(symbols)
    expect(r.guides).toBe(guides)
  })
})
