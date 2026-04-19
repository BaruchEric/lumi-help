import { describe, expect, it } from 'vitest'
import { blankDoc, computeState, mergeInteraction } from '../helpProgress'

describe('computeState', () => {
  it('returns unseen for missing entry or zero views', () => {
    expect(computeState(undefined)).toBe('unseen')
    expect(computeState({ views: 0, lastSeen: 0 })).toBe('unseen')
  })

  it('returns mastered when dismissed or views >= 3', () => {
    expect(computeState({ views: 1, lastSeen: 0, dismissed: true })).toBe('mastered')
    expect(computeState({ views: 3, lastSeen: 0 })).toBe('mastered')
    expect(computeState({ views: 10, lastSeen: 0 })).toBe('mastered')
  })

  it('returns exploring for 1–2 views', () => {
    expect(computeState({ views: 1, lastSeen: 0 })).toBe('exploring')
    expect(computeState({ views: 2, lastSeen: 0 })).toBe('exploring')
  })
})

describe('mergeInteraction', () => {
  it('creates the first entry with views=1', () => {
    const next = mergeInteraction(undefined, 1234)
    expect(next).toEqual({ views: 1, lastSeen: 1234 })
  })

  it('increments views and updates lastSeen', () => {
    const next = mergeInteraction({ views: 2, lastSeen: 1 }, 9999)
    expect(next).toEqual({ views: 3, lastSeen: 9999 })
  })

  it('preserves dismissed flag', () => {
    const next = mergeInteraction({ views: 1, lastSeen: 1, dismissed: true }, 2)
    expect(next.dismissed).toBe(true)
  })
})

describe('blankDoc', () => {
  it('returns a fresh empty progress document', () => {
    expect(blankDoc('u1')).toEqual({
      uid: 'u1',
      symbolHistory: {},
      learnMode: { enabled: false },
      updatedAt: 0,
    })
  })
})
