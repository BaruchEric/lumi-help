import { Apple, ChefHat, HeartPulse, Home, MoreHorizontal } from 'lucide-react'
import type { SymbolEntry } from '@baruch-eric/lumi-help'

export const NAV_SYMBOLS: SymbolEntry[] = [
  {
    id: 'nav.today',
    label: 'Today',
    section: 'nav',
    icon: Home,
    meaning: "Today's dashboard — quick log, goals, and highlights.",
    aliases: ['today', 'home', 'dashboard'],
  },
  {
    id: 'nav.health',
    label: 'Health',
    section: 'nav',
    icon: Apple,
    meaning: 'Food, recipes, vitals, sleep, fitness, and medical records.',
    aliases: ['health', 'food', 'wellness'],
  },
  {
    id: 'nav.food',
    label: 'Food',
    section: 'nav',
    icon: Apple,
    meaning: 'Log meals and review your diary.',
    aliases: ['food', 'diary', 'meals'],
  },
  {
    id: 'nav.recipes',
    label: 'Recipes',
    section: 'nav',
    icon: ChefHat,
    meaning: 'Build and browse your recipe library.',
    aliases: ['recipe', 'cook'],
  },
  {
    id: 'nav.vitals',
    label: 'Vitals',
    section: 'nav',
    icon: HeartPulse,
    meaning: 'Heart rate, blood pressure, and other vital signs.',
    aliases: ['vitals', 'heart', 'pressure'],
  },
  {
    id: 'nav.more',
    label: 'More',
    section: 'nav',
    icon: MoreHorizontal,
    meaning: 'Family, AI settings, profile, and help.',
    aliases: ['more', 'settings', 'profile'],
  },
]
