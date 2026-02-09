# @vitus-labs/hooks

Lightweight React hooks for common UI interactions.

[![npm](https://img.shields.io/npm/v/@vitus-labs/hooks)](https://www.npmjs.com/package/@vitus-labs/hooks)
[![license](https://img.shields.io/npm/l/@vitus-labs/hooks)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

## Installation

```bash
npm install @vitus-labs/hooks
```

## Hooks

### useHover

Tracks hover state with stable callback references.

```tsx
import { useHover } from '@vitus-labs/hooks'

const MyComponent = () => {
  const { hover, onMouseEnter, onMouseLeave } = useHover()

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ background: hover ? '#f0f0f0' : '#fff' }}
    >
      {hover ? 'Hovered' : 'Hover me'}
    </div>
  )
}
```

**Parameters:**

| Param | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| initialValue | `boolean` | `false` | Initial hover state |

**Returns:** `{ hover: boolean, onMouseEnter: () => void, onMouseLeave: () => void }`

### useWindowResize

Tracks viewport dimensions with throttled updates.

```tsx
import { useWindowResize } from '@vitus-labs/hooks'

const Layout = () => {
  const { width, height } = useWindowResize({
    throttleDelay: 300,
    onChange: ({ width }) => console.log('Width:', width),
  })

  return <div>Viewport: {width} x {height}</div>
}
```

**Parameters:**

| Param | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| params.throttleDelay | `number` | `200` | Milliseconds between resize handler calls |
| params.onChange | `(sizes) => void` | — | Callback fired on each resize |
| initialValues.width | `number` | `0` | Initial width (useful for SSR) |
| initialValues.height | `number` | `0` | Initial height (useful for SSR) |

**Returns:** `{ width: number, height: number }`

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| @vitus-labs/core | * |

## License

MIT
