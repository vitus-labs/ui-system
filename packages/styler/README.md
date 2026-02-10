# @vitus-labs/styler

A lightweight CSS-in-JS engine for React. Drop-in replacement for `styled-components` at a fraction of the size.

**3.06 KB** gzipped | **React 18+** | **SSR ready** | **TypeScript strict**

## Installation

```bash
npm install @vitus-labs/styler
# or
bun add @vitus-labs/styler
```

React 18+ is required as a peer dependency.

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

### Static path (zero runtime cost)

Templates with no function interpolations are resolved **once at component creation time**. The CSS class is computed and injected immediately, and the React component is a thin `forwardRef` wrapper with no hooks.

```tsx
// Class computed once at import time, not on every render
const Box = styled('div')`
  display: flex;
  padding: 16px;
`
```

### Dynamic path

Templates with function interpolations resolve on every render. The engine caches the last CSS string and skips re-hashing and re-injection when props haven't changed. Style injection uses `useInsertionEffect` for concurrent-mode safety.

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

## Migrating from styled-components

The API is intentionally compatible. Most code works by changing the import:

```diff
- import styled, { css, keyframes, createGlobalStyle, ThemeProvider } from 'styled-components'
+ import { styled, css, keyframes, createGlobalStyle, ThemeProvider } from '@vitus-labs/styler'
```

Key differences:

| Feature | styled-components | @vitus-labs/styler |
|---------|------------------|-------------------|
| Bundle size | ~16 KB gz | **3.06 KB gz** |
| `styled.div` shorthand | Yes | Yes |
| `as` prop | Yes | Yes |
| Ref forwarding | Yes | Yes |
| Transient `$` props | Yes | Yes |
| `shouldForwardProp` | `.withConfig()` | Second argument |
| SSR | `ServerStyleSheet` | `createSheet()` |
| CSS nesting | Preprocessed | Native (no transform) |
| `attrs()` | Yes | Use `@vitus-labs/attrs` |

## License

MIT
