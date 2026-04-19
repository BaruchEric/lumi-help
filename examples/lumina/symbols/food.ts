import { Drumstick, Droplet, Flame, Wheat } from 'lucide-react'
import type { SymbolEntry } from '@baruch-eric/lumi-help'

export const FOOD_SYMBOLS: SymbolEntry[] = [
  {
    id: 'nutrient.carbs',
    label: 'Carbohydrates',
    section: 'food',
    icon: Wheat,
    meaning: 'Grams of carbohydrates in this serving.',
    details:
      'Carbs include sugars, starches, and fiber. Lumina shows total carbs by default.',
    aliases: ['carbs', 'carbohydrate', 'sugar', 'net carbs'],
    learnMoreGuideId: 'logging-a-meal',
  },
  {
    id: 'nutrient.protein',
    label: 'Protein',
    section: 'food',
    icon: Drumstick,
    meaning: 'Grams of protein in this serving.',
    aliases: ['protein'],
    learnMoreGuideId: 'logging-a-meal',
  },
  {
    id: 'nutrient.fat',
    label: 'Fat',
    section: 'food',
    icon: Droplet,
    meaning: 'Grams of fat in this serving.',
    aliases: ['fat', 'lipids'],
  },
  {
    id: 'nutrient.calories',
    label: 'Calories',
    section: 'food',
    icon: Flame,
    meaning: 'Energy in this serving, in kilocalories (kcal).',
    aliases: ['calories', 'kcal', 'energy'],
  },
]
