# lumi-help

Embeddable in-app help center for React apps — symbol tooltips, Learn Mode,
guides, and an AI-backed Ask box. Bring your own content, storage, and AI
transport; the library handles the UI and the book-keeping.

## Install

```bash
bun add @baruch-eric/lumi-help
```

Peer deps: `react >= 18`, `react-dom >= 18`.

## Quickstart

```tsx
import '@baruch-eric/lumi-help/styles.css'
import {
  HelpPage,
  LearnModeProvider,
  RegistryProvider,
  SymbolTip,
  createRegistry,
} from '@baruch-eric/lumi-help'

const registry = createRegistry({
  symbols: [
    {
      id: 'nutrient.carbs',
      label: 'Carbohydrates',
      section: 'food',
      meaning: 'Grams of carbs in this serving.',
      learnMoreGuideId: 'logging-a-meal',
    },
  ],
  guides: [
    {
      id: 'logging-a-meal',
      title: 'Logging a meal',
      section: 'food',
      summary: 'From empty diary to saved meal in three taps.',
      body: '# Logging a meal\n\n1. Tap…',
    },
  ],
})

export function App() {
  return (
    <RegistryProvider registry={registry}>
      <LearnModeProvider>
        <SymbolTip id="nutrient.carbs">
          <span>Carbs</span>
        </SymbolTip>
        <HelpPage />
      </LearnModeProvider>
    </RegistryProvider>
  )
}
```

## Core concepts

- **Symbols** are small, tip-able UI tokens (an icon, a badge, a chip). Each
  entry has a stable `id`, a `label`, a `section`, and optional `meaning`,
  `details`, `aliases`, and `learnMoreGuideId`.
- **Guides** are markdown explainers grouped into sections. They render inside
  `<HelpPage>` and can be deep-linked with `#guide=<id>`.
- **Learn Mode** highlights un-explored symbols with a halo and a label pill.
  State is stored in a pluggable adapter (localStorage by default).

## Theming

All visual values in `@baruch-eric/lumi-help/styles.css` are CSS custom properties with
light-mode defaults. Override any of them in your own CSS — typically under
a theme selector like `.dark` or `[data-theme="night"]` — to match your
product. Example (Lumina's dark-mode overrides):

```css
.dark {
  --lumi-ink: #f3e9d8;
  --lumi-meaning: #c8c2b4;
  --lumi-subtle: #a8a196;
  --lumi-surface: #1a1a17;
  --lumi-surface-alt: #0f0f0d;
  --lumi-surface-hero-end: #2a2418;
  --lumi-tooltip-bg: #f3e9d8;
  --lumi-tooltip-fg: #1a1a17;
  --lumi-tooltip-meaning: #2b1f14;
  --lumi-border: #2a2418;
  --lumi-border-sand: #3a2e22;
  --lumi-border-strong: #4a3a2a;
}
```

The full list lives at the top of `src/styles.css`. Grouped: text (`--lumi-ink`,
`--lumi-meaning`, `--lumi-subtle`, `--lumi-ink-inverse`), accents
(`--lumi-accent`, `--lumi-accent-soft`, `--lumi-accent-wash`, halo variants),
surfaces (`--lumi-surface`, `--lumi-surface-alt`, `--lumi-surface-hero-end`,
`--lumi-tooltip-bg`, `--lumi-tooltip-fg`, `--lumi-tooltip-meaning`), borders,
error, radii, shadows, fonts.

## Adapters

### Storage

`LearnModeProvider` takes an optional `adapter: HelpProgressAdapter`:

```ts
interface HelpProgressAdapter {
  load(): Promise<HelpProgressDoc | null> | HelpProgressDoc | null
  save(doc: HelpProgressDoc): Promise<void> | void
}
```

Built-ins: `createLocalStorageAdapter(key?)` (default) and `memoryAdapter()`
(for tests). See `examples/lumina/firestoreAdapter.ts` for a Firestore adapter
with localStorage optimistic caching.

### AI transport

`<AskLumi>` and the bare `askLumi(q, registry, transport)` helper both take a
transport:

```ts
type AiTransport = (prompt: string) => Promise<string>
```

The default `noopTransport` returns a "not configured" message. Point it at
any chat/completion model — the library builds a grounded prompt from your
registry and parses `[[id]]` citation markers out of the response.

## Develop

```bash
bun install
bun run dev          # tsup watch
bun run test         # vitest
bun run lint         # biome check
bun run typecheck    # tsc --noEmit
bun run build        # produce dist/
```

## Example integration

See `examples/lumina/` for a complete wiring against Firebase + an AI gateway,
including seed content for a health-tracking app.

## License

MIT
