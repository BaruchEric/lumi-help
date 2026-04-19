import { BookOpen, FileText } from 'lucide-react'
import type { SymbolEntry } from 'lumi-help'

export const RECIPES_SYMBOLS: SymbolEntry[] = [
  {
    id: 'recipe.draft',
    label: 'Draft',
    section: 'recipes',
    icon: FileText,
    meaning: 'Recipe still being refined by the AI or you.',
    aliases: ['draft'],
  },
  {
    id: 'recipe.published',
    label: 'Published',
    section: 'recipes',
    icon: BookOpen,
    meaning: 'Recipe is finalized and logged to your library.',
    aliases: ['published', 'final'],
  },
]
