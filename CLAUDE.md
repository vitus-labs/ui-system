# Vitus Labs UI System

A modular React UI ecosystem: components, styling, layout, hooks, animations, and theming — with web and React Native support.

## Project Structure

Monorepo with 16 packages under `packages/`, managed with Bun workspaces and Lerna for publishing.

```
packages/
├── core/                  # CSS engine connector, init(), utilities (get, set, merge, compose, pick, omit)
├── styler/                # CSS-in-JS engine (~3KB gzip): css, styled, keyframes, ThemeProvider
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
├── kinetic-presets/       # 65+ animation presets + factories + composition utilities
└── native-primitives/     # React Native primitive components
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
Chain: `.theme()`, `.styles()`, `.attrs()`, `.config()`, `.statics()`, `.compose()`, plus dynamic dimension methods.

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
- Static templates (no function interpolations) → computed once, cached
- Dynamic templates → resolved per render, CSS string cache prevents recomputation
- SSR: React 19 `<style precedence>` for streaming

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

## Development Commands

```bash
bun install           # Install dependencies
bun run test          # Run all tests (Vitest, ~2600 tests in ~10s)
bun run lint          # Lint with Biome
bun run lint -- --fix # Auto-fix lint issues
bun run pkgs:build    # Build all packages (rolldown)
```

Single package:
```bash
npx lerna run build --scope=@vitus-labs/core --stream
```

## Build System

- Bundler: `@vitus-labs/tools-rolldown` (rolldown-based), config in `vl-tools.config.js`
- Output: `lib/` with ESM bundle + DTS
- Tests: Vitest with `resolve.conditions: ['source']` to resolve workspace packages to source

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
