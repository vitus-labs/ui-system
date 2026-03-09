# @vitus-labs/connector-native

CSS engine adapter for React Native — parses CSS template literals into style objects.

[![npm](https://img.shields.io/npm/v/@vitus-labs/connector-native)](https://www.npmjs.com/package/@vitus-labs/connector-native)
[![license](https://img.shields.io/npm/l/@vitus-labs/connector-native)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

Bridges the Vitus Labs component system to React Native. Instead of generating CSS class names and injecting `<style>` rules (as web connectors do), it parses CSS template literals into React Native `StyleSheet`-compatible objects and applies them via the `style` prop.

## Installation

```bash
npm install @vitus-labs/connector-native
```

**Peer dependencies:** `react`, `react-native`

## Usage

```tsx
import { init } from '@vitus-labs/core'
import { View, Text } from 'react-native'
import {
  css,
  styled,
  provider,
  useTheme,
  createMediaQueries,
} from '@vitus-labs/connector-native'

init({
  css,
  styled,
  provider,
  useTheme,
  component: View,
  textComponent: Text,
  createMediaQueries,
})
```

## Exports

| Export | Description |
| ------ | ----------- |
| `css` | Tagged template that parses CSS strings into RN style objects |
| `styled` | HOC that resolves CSS template and applies via `style` prop |
| `provider` / `ThemeProvider` | Theme context provider |
| `useTheme` | Hook to access the current theme |
| `createMediaQueries` | Breakpoint evaluator using `Dimensions.get('window').width` |

### css()

Parses CSS declarations into flat style objects:

```tsx
import { css } from '@vitus-labs/connector-native'

const base = css`
  width: 100px;
  background-color: blue;
  border-radius: 8px;
`
base.resolve({}) // { width: 100, backgroundColor: 'blue', borderRadius: 8 }
```

- CSS property names convert to camelCase (`background-color` -> `backgroundColor`)
- Numeric values parse to numbers (`100px` -> `100`)
- Supports dynamic interpolations: `${(p) => p.$color}`

### styled()

Creates a React component that resolves CSS into a `style` prop:

```tsx
import { styled } from '@vitus-labs/connector-native'
import { View } from 'react-native'

const Box = styled(View)`
  padding: 16px;
  background-color: #f0f0f0;
`
```

**Prop filtering:** `as`, `$`-prefixed, and `data-*` props are not forwarded. Customize with `shouldForwardProp`.

### createMediaQueries

Evaluates breakpoints using `Dimensions.get('window').width` at render time (mobile-first). Passed to `init()` and used automatically by `@vitus-labs/unistyle`.

## Differences from Web Connectors

| Feature | Web | Native |
|---------|-----|--------|
| Output | CSS string -> class name | Style object -> `style` prop |
| `@media` queries | Native CSS | `Dimensions` width check |
| CSS nesting (`&:hover`) | Supported | Ignored |
| `keyframes` | Supported | Not available |
| `createGlobalStyle` | Supported | Not available |

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| react-native | >= 0.76 |

## License

MIT
