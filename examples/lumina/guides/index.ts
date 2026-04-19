import type { GuideEntry } from 'lumi-help'
// Vite raw imports — each `.md?raw` resolves to the file's text at build time.
// Non-Vite bundlers: import the markdown as a string via your own loader.
import gettingStarted from './getting-started.md?raw'
import loggingAMeal from './logging-a-meal.md?raw'
import sharingFamily from './sharing-with-family.md?raw'

export const GUIDE_ENTRIES: GuideEntry[] = [
  {
    id: 'getting-started',
    title: 'Welcome to Lumina',
    section: 'nav',
    summary: 'A quick tour of the app.',
    body: gettingStarted,
    aliases: ['start', 'tour', 'welcome'],
  },
  {
    id: 'logging-a-meal',
    title: 'Logging a meal',
    section: 'food',
    summary: 'From empty Diary to saved meal in three taps.',
    body: loggingAMeal,
    relatedSymbols: [
      'nutrient.carbs',
      'nutrient.protein',
      'nutrient.fat',
      'nutrient.calories',
    ],
    aliases: ['log', 'meal', 'diary'],
  },
  {
    id: 'sharing-with-family',
    title: 'Sharing with family',
    section: 'sharing',
    summary: 'Private, Shared, and Public states explained.',
    body: sharingFamily,
    relatedSymbols: ['sharing.private', 'sharing.shared', 'sharing.public'],
    aliases: ['share', 'family', 'household'],
  },
]
