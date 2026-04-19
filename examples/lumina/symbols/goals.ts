import { AlertTriangle, Check, Target, TrendingUp } from 'lucide-react'
import type { SymbolEntry } from 'lumi-help'

export const GOALS_SYMBOLS: SymbolEntry[] = [
  {
    id: 'goal.target',
    label: 'Daily target',
    section: 'goals',
    icon: Target,
    meaning: 'The amount you are aiming for today.',
    aliases: ['target', 'goal', 'aim'],
  },
  {
    id: 'goal.progress',
    label: 'Progress',
    section: 'goals',
    icon: TrendingUp,
    meaning: 'How close you are to your target for today.',
    aliases: ['progress', 'percent'],
  },
  {
    id: 'goal.met',
    label: 'Goal met',
    section: 'goals',
    icon: Check,
    meaning: "You've hit your target for today.",
    aliases: ['met', 'done', 'achieved'],
  },
  {
    id: 'goal.over',
    label: 'Over goal',
    section: 'goals',
    icon: AlertTriangle,
    meaning:
      "You've gone past your target. Red numbers on the diary indicate this.",
    aliases: ['over', 'exceeded'],
  },
]
