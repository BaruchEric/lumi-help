# Lumina — example integration

Seed content and adapters that the Lumina health-tracker app uses to wire
`@baruch-eric/lumi-help` into its UI. Use as a reference; none of these files
are part of the published package.

## What's here

- `symbols/` — six categories of symbol definitions (food, sharing, ai, nav,
  goals, recipes). Each entry has an id, label, optional icon, and optional
  `learnMoreGuideId` pointing at a guide.
- `guides/` — three markdown guides plus an `index.ts` that assembles them
  into `GuideEntry[]`. The `?raw` imports are Vite-specific; non-Vite users
  should read the markdown into a string via their bundler of choice.
- `registry.ts` — combines symbols + guides into a single `Registry`, and
  declares the display order of sections on `<HelpPage>`.
- `firestoreAdapter.ts` — persists `HelpProgressDoc` to Firestore with
  localStorage optimistic caching. Conforms to `HelpProgressAdapter`.
- `geminiTransport.ts` — wraps an AI gateway as an `AiTransport` for
  `<AskLumi>`.

## Wiring it up in Lumina

```tsx
import '@baruch-eric/lumi-help/styles.css'
import {
  HelpPage,
  LearnModeProvider,
  RegistryProvider,
} from '@baruch-eric/lumi-help'
import { luminaRegistry, luminaSections } from './registry'
import { firestoreHelpProgressAdapter } from './firestoreAdapter'
import { geminiTransport } from './geminiTransport'

export function AppShell({ children, db, uid }) {
  return (
    <RegistryProvider registry={luminaRegistry}>
      <LearnModeProvider adapter={firestoreHelpProgressAdapter(db, uid)} uid={uid}>
        {children}
      </LearnModeProvider>
    </RegistryProvider>
  )
}

export function LuminaHelpPage() {
  return (
    <HelpPage
      title="Help &amp; Guide"
      subtitle="Find your way around Lumina."
      sections={luminaSections}
      ask={{ transport: geminiTransport(currentUid), options: {
        persona: 'You are Lumi, the friendly in-app help assistant for Lumina.',
      }}}
    />
  )
}
```
