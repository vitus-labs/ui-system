# @vitus-labs/core

Shared foundation for the UI System ecosystem.

[![npm](https://img.shields.io/npm/v/@vitus-labs/core)](https://www.npmjs.com/package/@vitus-labs/core)
[![license](https://img.shields.io/npm/l/@vitus-labs/core)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

Provides utility functions, a styling engine bridge, theme context, and HTML tag definitions used across all `@vitus-labs` packages. No external utility dependencies — all implementations are built-in with prototype pollution protection where applicable.

## Installation

```bash
npm install @vitus-labs/core
```

## API

### Provider & Context

```tsx
import { Provider, context, config, init } from '@vitus-labs/core'
```

**Provider** wraps your app with a theme context. It bridges styled-components' `ThemeProvider` with the internal context system.

```tsx
import { Provider } from '@vitus-labs/core'

<Provider theme={{ rootSize: 16, breakpoints: { xs: 0, md: 768 } }}>
  {children}
</Provider>
```

**config / init** — configure the styling engine. By default wired to `styled-components`, but can be swapped for another CSS-in-JS library.

```tsx
import { config } from '@vitus-labs/core'

const { styled, css } = config
```

### Utilities

#### compose

Right-to-left function composition.

```tsx
import { compose } from '@vitus-labs/core'

const transform = compose(toUpperCase, trim, normalize)
transform('  hello  ') // => 'HELLO'
```

#### render

Flexible element renderer. Handles components, elements, primitives, and arrays.

```tsx
import { render } from '@vitus-labs/core'

render('hello')           // => 'hello'
render(MyComponent)       // => <MyComponent />
render(<div>hi</div>)     // => clones element
render(null)              // => null
```

#### isEmpty

Type-safe emptiness check. Returns `true` for `null`, `undefined`, `{}`, `[]`, and non-object primitives.

```tsx
import { isEmpty } from '@vitus-labs/core'

isEmpty({})        // => true
isEmpty([])        // => true
isEmpty(null)      // => true
isEmpty({ a: 1 }) // => false
```

#### omit / pick

Create objects without or with only specified keys. Accept nullable inputs.

```tsx
import { omit, pick } from '@vitus-labs/core'

omit({ a: 1, b: 2, c: 3 }, ['b'])    // => { a: 1, c: 3 }
pick({ a: 1, b: 2, c: 3 }, ['a', 'b']) // => { a: 1, b: 2 }
```

#### set / get

Nested property access and mutation by dot/bracket path. `set` has built-in prototype pollution protection — keys like `__proto__`, `constructor`, and `prototype` are blocked.

```tsx
import { set, get } from '@vitus-labs/core'

const obj = {}
set(obj, 'a.b.c', 42)    // => { a: { b: { c: 42 } } }
get(obj, 'a.b.c')         // => 42
get(obj, 'a.x', 'default') // => 'default'
```

#### merge

Deep merge objects left-to-right. Only plain objects are recursed into; arrays are replaced wholesale. Prototype pollution keys are blocked.

```tsx
import { merge } from '@vitus-labs/core'

merge({ a: { x: 1 } }, { a: { y: 2 } }) // => { a: { x: 1, y: 2 } }
```

#### throttle

Limits function execution to at most once per wait period. Returns a throttled function with a `.cancel()` method.

```tsx
import { throttle } from '@vitus-labs/core'

const throttled = throttle(handleResize, 200)
window.addEventListener('resize', throttled)
// cleanup: throttled.cancel()
```

### HTML Constants

```tsx
import { HTML_TAGS, HTML_TEXT_TAGS } from '@vitus-labs/core'
```

- **HTML_TAGS** — array of 100+ valid HTML tag names
- **HTML_TEXT_TAGS** — array of text-content tags (h1–h6, p, span, strong, em, etc.)

Both have corresponding TypeScript union types: `HTMLTags` and `HTMLTextTags`.

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| styled-components | >= 6 |

## License

MIT
