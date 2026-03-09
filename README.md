# UI System

A composable toolkit for building React UI systems.

[![license](https://img.shields.io/npm/l/@vitus-labs/core)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

UI System is not a component library. It's a set of composable packages for building your own — with responsive props, multi-dimensional theming, type-safe chainable APIs, and auto-generated Storybook stories.

## Architecture

```text
                     core
                   /      \
               attrs      unistyle      hooks
              /    \        |    \        |
       rocketstyle  \   elements  coolgrid  kinetic
            |        \                       |
       rocketstories  \              kinetic-presets
```

## Packages

### Styling & Layout

| Package | Description |
| ------- | ----------- |
| [@vitus-labs/core](./packages/core) | Shared utilities, styling engine bridge, theme context |
| [@vitus-labs/styler](./packages/styler) | Lightweight CSS-in-JS engine (3.81 KB gz) — drop-in styled-components replacement |
| [@vitus-labs/attrs](./packages/attrs) | Immutable chainable default-props factory for React components |
| [@vitus-labs/elements](./packages/elements) | Layout primitives — Element, Text, List, Overlay, Portal |
| [@vitus-labs/unistyle](./packages/unistyle) | Responsive CSS engine — media queries, unit conversion, style processing |
| [@vitus-labs/coolgrid](./packages/coolgrid) | Bootstrap-inspired responsive grid with context-cascading config |
| [@vitus-labs/hooks](./packages/hooks) | 28 React hooks — useHover, useBreakpoint, useFocusTrap, and more |
| [@vitus-labs/rocketstyle](./packages/rocketstyle) | Multi-dimensional styling system with type-safe chains |
| [@vitus-labs/rocketstories](./packages/rocketstories) | Auto-generated Storybook stories from rocketstyle components |

### Animation

| Package | Size (gzip) | Description |
| ------- | ----------- | ----------- |
| [@vitus-labs/kinetic](./packages/kinetic) | 3.2 KB | CSS-first animation — enter/exit, stagger, collapse, list reconciliation |
| [@vitus-labs/kinetic-presets](./packages/kinetic-presets) | 2.3 KB | 122 presets, 5 factories, 5 composition utilities for kinetic |

### Connectors

| Package | Description |
| ------- | ----------- |
| [@vitus-labs/connector-styler](./packages/connector-styler) | Connector for `@vitus-labs/styler` (recommended) |
| [@vitus-labs/connector-emotion](./packages/connector-emotion) | Connector for Emotion |
| [@vitus-labs/connector-styled-components](./packages/connector-styled-components) | Connector for styled-components |
| [@vitus-labs/connector-native](./packages/connector-native) | Connector for React Native |

## Quick Start

```bash
npm install @vitus-labs/core @vitus-labs/styler @vitus-labs/connector-styler @vitus-labs/elements @vitus-labs/rocketstyle
```

Initialize the CSS-in-JS engine at your app entry point:

```tsx
import { init } from '@vitus-labs/core'
import connector from '@vitus-labs/connector-styler'

init({ ...connector, component: 'div', textComponent: 'span' })
```

Create a styled button using rocketstyle:

```tsx
import rocketstyle from '@vitus-labs/rocketstyle'
import { Element } from '@vitus-labs/elements'

const Button = rocketstyle()({
  name: 'Button',
  component: Element,
})
  .attrs({ tag: 'button' })
  .theme({
    fontSize: 16,
    paddingX: 16,
    paddingY: 8,
    borderRadius: 4,
    color: '#fff',
    backgroundColor: '#0d6efd',
  })
  .states({
    danger: { backgroundColor: '#dc3545' },
    success: { backgroundColor: '#198754' },
  })
  .sizes({
    sm: { fontSize: 14, paddingX: 12, paddingY: 6 },
    lg: { fontSize: 18, paddingX: 20, paddingY: 10 },
  })
```

```tsx
<Button label="Submit" />
<Button state="danger" size="lg" label="Delete" />
```

## Design Philosophy

- **Composition over inheritance** — factory patterns and chainable APIs instead of class hierarchies
- **Responsive-first** — every layout prop accepts a single value, mobile-first array, or breakpoint object
- **Type-safe chains** — full TypeScript inference through `.attrs()`, `.theme()`, `.states()`, and other chain methods
- **Zero-config defaults** — sensible defaults everywhere, override only what you need

## React Native

For React Native support, use `@vitus-labs/connector-native` instead of `connector-styler`:

```bash
npm install @vitus-labs/core @vitus-labs/connector-native @vitus-labs/elements @vitus-labs/rocketstyle
```

```tsx
import { init } from '@vitus-labs/core'
import { View, Text } from 'react-native'
import { css, styled, provider, useTheme, createMediaQueries } from '@vitus-labs/connector-native'

init({ css, styled, provider, useTheme, component: View, textComponent: Text, createMediaQueries })
```

## Requirements

- React >= 19
- TypeScript >= 5 (recommended)

## License

MIT
