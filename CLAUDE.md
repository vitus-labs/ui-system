# Vitus Labs UI System

A modular React UI ecosystem: components, styling, layout, hooks, animations, and theming — with web and React Native support.

## Project Structure

Monorepo with 15 packages under `packages/`, managed with Bun workspaces. Publishing via Changesets (Lerna removed in #147).

```
packages/
├── core/                  # CSS engine connector, init(), utilities (get, set, merge, compose, pick, omit)
├── styler/                # CSS-in-JS engine (~7.5KB gzip): css, styled, keyframes, ThemeProvider
├── connector-styler/      # Connects styler to core's engine interface
├── connector-emotion/     # Connects Emotion to core's engine interface
├── connector-styled-components/  # Connects styled-components to core's engine interface
├── connector-native/      # React Native CSS connector (CSS strings → RN style objects)
├── elements/              # Base primitives: Element, Text, List, Overlay, Portal
├── attrs/                 # Chainable component factory: attrs().attrs().config().statics().compose()
├── rocketstyle/           # Multi-state styling: dimensions, themes, dark/light mode
├── rocketstories/         # Auto-generated Storybook stories from rocketstyle components
├── unistyle/              # 170+ CSS property mappings, responsive breakpoints, unit conversion
├── coolgrid/              # Responsive 12-column grid: Container, Row, Col
├── hooks/                 # 27+ React hooks (DOM, state, accessibility, timing, theme)
├── kinetic/               # CSS-transition animations: Transition, TransitionGroup, Stagger, Collapse
└── kinetic-presets/       # 65+ animation presets + factories + composition utilities
```

## Setup & Initialization

Every app must initialize the CSS engine before rendering:

```tsx
import { init } from '@vitus-labs/core'
import * as connector from '@vitus-labs/connector-styler'

init({ ...connector, component: 'div', textComponent: 'span' })
```

For React Native:
```tsx
import * as connector from '@vitus-labs/connector-native'
import { View, Text } from 'react-native'

init({ ...connector, component: View, textComponent: Text })
```

## Key Patterns

### Attrs Chain (component composition)
```tsx
const Button = attrs({ name: 'Button', component: Element })
  .attrs({ tag: 'button' })
  .attrs<{ primary?: boolean }>(({ primary }) => ({
    css: primary ? primaryStyles : secondaryStyles,
  }))
  .statics({ isButton: true })
```
**Props merge order:** priorityAttrs → attrs → explicit props (last wins).

### Rocketstyle (multi-state styling)
```tsx
const Button = rocketstyle({
  dimensions: { size: ['sm', 'md', 'lg'], variant: ['primary', 'secondary'] },
  useBooleans: true,
})({ name: 'Button', component: Element })
  .theme({ backgroundColor: '#fff' })
  .styles((css) => css`padding: 8px 16px;`)
  .attrs(({ size }) => ({ tag: 'button' }))
```
Chain methods come from two places:
- `.theme()`, `.styles()`, `.compose()` and dynamic dimension methods → attached by `createStaticsChainingEnhancers` (driven by `STATIC_KEYS`)
- `.attrs()`, `.config()`, `.statics()`, `getStaticDimensions()`, `getDefaultAttrs()` → attached via `Object.assign` in `rocketstyle.tsx`
Don't hardcode the dynamic ones in `Object.assign` — they'll shadow the dynamic version.

### Styler (CSS-in-JS)
```tsx
import { css, styled } from '@vitus-labs/connector-styler'

const highlight = css`color: ${p => p.theme.colors.primary};`

const Card = styled.div`
  ${highlight}
  padding: 1rem;
  &:hover { opacity: 0.8; }
`
```
- Static templates (no function interpolations) → computed once, cached via single-entry hot cache + WeakMap fallback
- Dynamic templates → resolved per render, CSS string cache prevents recomputation
- `prepare()` results are cached by cssText for SSR `<style precedence>` reuse
- `splitAtRules` extracts nested @media/@supports/@container into separate top-level rules
- SSR: React 19 `<style precedence>` for streaming
- Both `cache` and `normalizeCSS` cache evict the oldest 10% when over threshold (shared `evictMapByPercent` util)

### Responsive Grid
```tsx
<Container columns={12} gap={16}>
  <Row>
    <Col size={{ xs: 12, md: 6, lg: 4 }}>Content</Col>
  </Row>
</Container>
```

### Kinetic Animations
```tsx
import { Transition, Stagger } from '@vitus-labs/kinetic'
import { fadeUp } from '@vitus-labs/kinetic-presets'

<Transition show={visible} {...fadeUp}>
  <div>Animated content</div>
</Transition>

<Stagger show={visible} interval={50} {...fadeUp}>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</Stagger>
```
`TransitionGroup` caches per-key `onAfterLeave` callbacks via a ref Map so a single child finishing leaving doesn't churn fresh callback props for siblings.

## Development Commands

```bash
bun install                 # Install dependencies
bun run test                # Run all tests (Vitest, ~2599 tests in ~10s)
bun run lint                # Lint with Biome
bun run lint -- --fix       # Auto-fix lint issues
bun run pkgs:build          # Build all packages (rolldown)
bun run typecheck           # Typecheck all packages
bun run size                # Check bundle sizes against budgets
```

Single package (Lerna removed; use bun workspaces):
```bash
bun run --filter=@vitus-labs/core build
```

## Build System

- Bundler: `@vitus-labs/tools-rolldown` (rolldown-based), config in `vl-tools.config.js`
- Output: `lib/` with ESM bundle + DTS
- Tests: Vitest with `resolve.conditions: ['source']` to resolve workspace packages to source
- CI bundle-size budgets enforced via `size-limit` (config in `.size-limit.json`)

## Platform Support

- `.native.ts` convention: auto-resolved by Metro and rolldown
- Elements `index.native.ts` excludes Portal/Overlay (depend on react-dom)
- connector-native `styled` filters out `as`, `$`-prefixed, `data-*` props
- Unistyle uses `Dimensions.get('window').width` on native instead of CSS @media

## Architecture Notes

- `core/config.ts` uses lazy delegate pattern — `css`/`styled` can be destructured before `init()` is called
- `CSSEngineConnector` interface: css, styled, provider (required) + keyframes, createGlobalStyle, useTheme (optional)
- `PlatformConfig`: component, textComponent, createMediaQueries
- Inter-package deps use `workspace:*` protocol
- Circular dep: elements ↔ rocketstyle (story-only, not structural)
- Overlay's `useOverlay` is split into focused modules: `positionMath.ts` (pure math), `useEscapeKey.ts`, `useHoverListeners.ts`, `useScrollReposition.ts`. Follow the same pattern for new "fat hook" cases.
- `Element.equalize` uses `ResizeObserver` instead of running layout in `useLayoutEffect` on every prop change.

## Type System Notes

- The `attrs` and `rocketstyle` chain machinery (`Object.assign(Component, { method... })` + recursive `cloneAndEnhance` factory call) hits a fundamental TS limitation: chain method **return** types can't be expressed at the impl level. The current code uses one boundary cast per package — don't try to fix it without redesigning the chain machinery (builder class / phantom-type tuple / HKT encoding).
- Internal `any` parameters in chain method impls (`attrs.tsx`, `rocketstyle.tsx`) have been replaced with proper interface types (PR #170). The pattern: public interface declares the precise types; impl `Object.assign` bypasses return-type checks but *parameters* should be properly typed.
- `useExhaustiveDependencies` for `useMemo` in rocketstyle: factory-closure-captured options (e.g. `options.transformKeys`) are stable for the component's lifetime — use `// biome-ignore lint/correctness/useExhaustiveDependencies` with a clear reason instead of adding to deps.
- `rocketstateRef` in rocketstyle uses a shallow-equal pattern to keep useMemo's identity stable across renders when dimension values are unchanged. See `isShallowEqualRocketstate` in `rocketstyle.tsx`.

## Performance Hot Paths

These were optimized in PR #166 — don't regress:
- `unistyle/units/stripUnit.ts`: regex hoisted to module scope
- `rocketstyle/utils/theme.ts`: `getTheme()` mutates `finalTheme` directly (merge() does copy-on-write for nested plain objects, so baseTheme stays untouched)
- `coolgrid/useContext.tsx`: `useGridContext` result memoized
- `styler/styled.ts`: `theme` injected by mutating freshly-spread `rawProps`, then restored — avoids second n-key spread per dynamic render
- `attrs/hoc/attrsHoc.tsx`: fast path when no `.attrs()`/`.priorityAttrs()` configured
- `hooks/useFocusTrap.ts`: focusable NodeList cached, refreshed via MutationObserver
- `hooks/useBreakpoint.ts`: single rAF-throttled resize listener (was N matchMedia listeners)
