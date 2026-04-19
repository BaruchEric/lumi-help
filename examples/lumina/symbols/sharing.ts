import { Globe, Lock, Users } from 'lucide-react'
import type { SymbolEntry } from '@baruch-eric/lumi-help'

export const SHARING_SYMBOLS: SymbolEntry[] = [
  {
    id: 'sharing.private',
    label: 'Private',
    section: 'sharing',
    icon: Lock,
    meaning: 'Only you can see this item.',
    aliases: ['private', 'personal'],
    learnMoreGuideId: 'sharing-with-family',
  },
  {
    id: 'sharing.shared',
    label: 'Shared with family',
    section: 'sharing',
    icon: Users,
    meaning: 'Visible to people you share with in this household.',
    aliases: ['shared', 'family', 'household'],
    learnMoreGuideId: 'sharing-with-family',
  },
  {
    id: 'sharing.public',
    label: 'Public',
    section: 'sharing',
    icon: Globe,
    meaning: 'Visible to anyone with the link.',
    aliases: ['public', 'link'],
    learnMoreGuideId: 'sharing-with-family',
  },
]
