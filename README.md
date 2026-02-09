# UI System

A composable toolkit for building React UI systems with styled-components.

[![license](https://img.shields.io/npm/l/@vitus-labs/core)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

UI System is not a component library. It's a set of composable packages for building your own — with responsive props, multi-dimensional theming, type-safe chainable APIs, and auto-generated Storybook stories.

## Architecture

```text
                     core
                   /      \
               attrs      unistyle      hooks
              /    \        |    \
       rocketstyle  \   elements  coolgrid
            |        \
       rocketstories  \
```

## Packages

| Package | Description |
| ------- | ----------- |
| [@vitus-labs/core](./packages/core) | Shared utilities, styling engine bridge, theme context |
| [@vitus-labs/attrs](./packages/attrs) | Immutable chainable default-props factory for React components |
| [@vitus-labs/elements](./packages/elements) | Layout primitives — Element, Text, List, Overlay, Portal |
| [@vitus-labs/unistyle](./packages/unistyle) | Responsive CSS engine — media queries, unit conversion, style processing |
| [@vitus-labs/coolgrid](./packages/coolgrid) | Bootstrap-inspired responsive grid with context-cascading config |
| [@vitus-labs/hooks](./packages/hooks) | Lightweight React hooks — useHover, useWindowResize |
| [@vitus-labs/rocketstyle](./packages/rocketstyle) | Multi-dimensional styling system with type-safe chains |
| [@vitus-labs/rocketstories](./packages/rocketstories) | Auto-generated Storybook stories from rocketstyle components |

## Quick Start

```bash
npm install @vitus-labs/elements @vitus-labs/rocketstyle @vitus-labs/unistyle @vitus-labs/core styled-components
```

Set up the provider:

```tsx
import { Provider } from '@vitus-labs/unistyle'

const theme = {
  rootSize: 16,
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
}

const App = () => (
  <Provider theme={theme}>
    {/* your app */}
  </Provider>
)
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

## Requirements

- React >= 19
- styled-components >= 6
- TypeScript >= 5 (recommended)

## License

MIT
