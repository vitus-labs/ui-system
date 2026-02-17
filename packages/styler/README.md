# @vitus-labs/styler

A lightweight CSS-in-JS engine for React. Drop-in replacement for `styled-components` at a fraction of the size.

**3.81 KB** gzipped | **React 19+** | **SSR & static export ready** | **TypeScript strict**

## Installation

```bash
npm install @vitus-labs/styler
# or
bun add @vitus-labs/styler
```

React 19+ is required as a peer dependency.

## Quick Start

```tsx
import { styled, css, ThemeProvider } from '@vitus-labs/styler'

const Button = styled('button')`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

function App() {
  return (
    <ThemeProvider theme={{ colors: { primary: '#3b82f6' } }}>
      <Button>Click me</Button>
    </ThemeProvider>
  )
}
```

## API

### `styled(tag)`

Creates a styled React component from an HTML tag or another component.

```tsx
// HTML tag
const Box = styled('div')`
  display: flex;
`

// Shorthand (via Proxy)
const Box = styled.div`
  display: flex;
`

// Wrapping a component
const StyledLink = styled(Link)`
  color: blue;
  text-decoration: none;
`
```

#### Dynamic interpolations

Function interpolations receive all props plus the current `theme`:

```tsx
const Text = styled('p')`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${(props) => props.$size || '16px'};
`
```

#### Polymorphic `as` prop

Render as a different element at runtime:

```tsx
const Box = styled('div')`padding: 16px;`

<Box as="section">Renders as a &lt;section&gt;</Box>
```

#### Ref forwarding

All styled components forward refs via `React.forwardRef`:

```tsx
const Input = styled('input')`border: 1px solid #ccc;`

const ref = useRef<HTMLInputElement>(null)
<Input ref={ref} />
```

#### Transient props

Props prefixed with `$` are not forwarded to the DOM:

```tsx
const Box = styled('div')`
  color: ${(p) => p.$active ? 'blue' : 'gray'};
`

// $active is used for styling but won't appear on the <div>
<Box $active />
```

#### Custom prop filtering

```tsx
const Box = styled('div', {
  shouldForwardProp: (prop) => prop !== 'size',
})`
  font-size: ${(p) => p.size}px;
`
```

### `css`

Tagged template for composable CSS fragments:

```tsx
const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Card = styled('div')`
  ${flexCenter};
  padding: 16px;
`
```

Supports conditional patterns:

```tsx
const Box = styled('div')`
  display: flex;
  ${(props) => props.$bordered && css`
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  `};
`
```

### `keyframes`

Creates `@keyframes` animations:

```tsx
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const FadeBox = styled('div')`
  animation: ${fadeIn} 300ms ease-in;
`
```

### `createGlobalStyle`

Injects global CSS rules (not scoped to a class):

```tsx
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font};
  }
`

// Renders nothing, injects CSS when mounted
<GlobalStyle />
```

### `ThemeProvider` & `useTheme`

Provides a theme object to all nested styled components via React context:

```tsx
const theme = {
  colors: { primary: '#3b82f6', text: '#111' },
  spacing: (n: number) => `${n * 4}px`,
}

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

Access the theme from any component:

```tsx
const MyComponent = () => {
  const theme = useTheme()
  return <div style={{ color: theme.colors.primary }} />
}
```

#### TypeScript theme augmentation

Extend `DefaultTheme` for strict typing across your app:

```ts
declare module '@vitus-labs/styler' {
  interface DefaultTheme {
    colors: { primary: string; text: string }
    spacing: (n: number) => string
  }
}
```

### `sheet` & `createSheet`

The singleton `sheet` manages CSS rule injection. For SSR, use `createSheet` for per-request isolation:

```tsx
import { createSheet } from '@vitus-labs/styler'

// Server-side rendering
const sheet = createSheet()
const html = renderToString(<App />)
const styleTags = sheet.getStyleTag()  // <style data-vl="">...</style>
sheet.reset()
```

#### `@layer` support

Wrap all scoped rules in a CSS Cascade Layer:

```tsx
import { createSheet } from '@vitus-labs/styler'

const sheet = createSheet({ layer: 'components' })
```

#### HMR cleanup

```tsx
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    sheet.clearAll()
  })
}
```

## How It Works

### FOUC-free SSR & Static Export

Styler uses React 19's `<style precedence>` resource system. Each styled component renders an inline `<style href="..." precedence="medium">` element alongside its markup. React automatically hoists these to `<head>`, deduplicates by `href`, and preserves them during hydration. This eliminates Flash of Unstyled Content (FOUC) for both SSR streaming and static export (e.g. `next export`) with zero configuration.

### Static path (zero runtime cost)

Templates with no function interpolations are resolved **once at component creation time**. The CSS class, rules, and `<style>` element are pre-computed and cached. The React component is a thin `forwardRef` wrapper that reuses the same cached element reference on every render.

```tsx
// Class + <style> element computed once at import time, not on every render
const Box = styled('div')`
  display: flex;
  padding: 16px;
`
```

### Dynamic path

Templates with function interpolations resolve on every render. A `useRef` cache skips `sheet.prepare()` and `<style>` element creation when the resolved CSS text hasn't changed between renders.

### Single-pass prop builder

Styled components build the final props object in a single allocation and loop — className merging, ref injection, and prop filtering (transient `$` props, DOM validation) happen in one pass instead of three separate object spreads.

### CSS Nesting

Native CSS nesting is supported out of the box. The engine passes CSS through without transformation, so `&:hover`, `&::before`, nested selectors, and `@media` queries work as-is in all modern browsers.

```tsx
const Card = styled('div')`
  padding: 16px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  & > h2 {
    margin: 0 0 8px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`
```

## Benchmarks

All benchmarks run via Vitest bench on the same machine. React is externalized in all bundle measurements.

### Bundle Size

| Library | Minified | Gzipped |
|---------|--------:|--------:|
| goober | 2.32 KB | 1.31 KB |
| **@vitus-labs/styler** | **10.13 KB** | **3.81 KB** |
| styled-components | 44.93 KB | 17.89 KB |
| @emotion/react + styled | 48.26 KB | 16.59 KB |

### Performance (ops/sec, higher is better)

| Benchmark | styler | styled-components | @emotion | goober |
|-----------|-------:|-------------------:|---------:|-------:|
| css() creation | **25.0M** | 9.3M | 2.3M | 24K |
| css() with interpolations | **24.7M** | 5.5M | 2.3M | 25K |
| Template resolution | **19.1M** | 4.0M | - | - |
| Nested composition | **9.0M** | 2.2M | 1.4M | 7.1K |
| styled() factory | 378K | 113K | 999K | 19.9M |

Styler is **2.7-1270x faster** than alternatives across css creation and composition. The only benchmark where styler isn't fastest is `styled()` factory creation, where goober defers all work (no-op wrapper) and Emotion defers to first render. Styler trades creation speed for render speed — CSS is pre-computed at creation time so every subsequent render is faster.

## Migrating from styled-components

The API is intentionally compatible. Most code works by changing the import:

```diff
- import styled, { css, keyframes, createGlobalStyle, ThemeProvider } from 'styled-components'
+ import { styled, css, keyframes, createGlobalStyle, ThemeProvider } from '@vitus-labs/styler'
```

Key differences:

| Feature | styled-components | @vitus-labs/styler |
|---------|------------------|-------------------|
| Bundle size | ~16 KB gz | **3.81 KB gz** |
| `styled.div` shorthand | Yes | Yes |
| `as` prop | Yes | Yes |
| Ref forwarding | Yes | Yes |
| Transient `$` props | Yes | Yes |
| `shouldForwardProp` | `.withConfig()` | Second argument |
| SSR | `ServerStyleSheet` | Automatic (React 19 resources) |
| Static export | Manual setup | FOUC-free out of the box |
| CSS nesting | Preprocessed | Native (no transform) |
| `attrs()` | Yes | Use `@vitus-labs/attrs` |

## License

MIT
