import { createRegistry } from '@baruch-eric/lumi-help'
import { GUIDE_ENTRIES } from './guides'
import { AI_SYMBOLS } from './symbols/ai'
import { FOOD_SYMBOLS } from './symbols/food'
import { GOALS_SYMBOLS } from './symbols/goals'
import { NAV_SYMBOLS } from './symbols/nav'
import { RECIPES_SYMBOLS } from './symbols/recipes'
import { SHARING_SYMBOLS } from './symbols/sharing'

export const luminaRegistry = createRegistry({
  symbols: [
    ...FOOD_SYMBOLS,
    ...SHARING_SYMBOLS,
    ...AI_SYMBOLS,
    ...NAV_SYMBOLS,
    ...RECIPES_SYMBOLS,
    ...GOALS_SYMBOLS,
  ],
  guides: GUIDE_ENTRIES,
})

export const luminaSections = [
  { id: 'food', label: 'Food & Nutrition' },
  { id: 'sharing', label: 'Sharing & Family' },
  { id: 'ai', label: 'AI & Creativity' },
  { id: 'nav', label: 'Navigation' },
  { id: 'goals', label: 'Goals' },
  { id: 'recipes', label: 'Recipes' },
]
