# @vitus-labs/rocketstyle

Multi-dimensional styling system for React.

[![npm](https://img.shields.io/npm/v/@vitus-labs/rocketstyle)](https://www.npmjs.com/package/@vitus-labs/rocketstyle)
[![license](https://img.shields.io/npm/l/@vitus-labs/rocketstyle)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

Organize component styles by dimensions — states, sizes, variants — instead of flat props. Chain theme values, attach styled-components CSS, and get full TypeScript inference. Built-in pseudo-state handling, light/dark mode, and provider/consumer patterns for parent-child state propagation.

## Features

- **Dimension-based theming** — define style variations as named dimensions (states, sizes, variants)
- **Immutable chaining** — `.attrs()`, `.theme()`, `.states()`, `.sizes()`, `.styles()` and more
- **Boolean shorthand** — `<Button primary lg>` instead of `<Button state="primary" size="lg">`
- **Pseudo-state detection** — hover, focus, pressed, active tracked via context
- **Light/dark mode** — theme callbacks receive a mode parameter
- **Provider/Consumer** — propagate parent state to children through context
- **WeakMap caching** — computed themes cached per component instance
- **TypeScript inference** — dimension values and prop types inferred through the chain

## Installation

```bash
npm install @vitus-labs/rocketstyle @vitus-labs/core styled-components
```

## Quick Start

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
    hover: {
      backgroundColor: '#0b5ed7',
    },
  })
  .states({
    primary: {
      backgroundColor: '#0d6efd',
      hover: { backgroundColor: '#0b5ed7' },
    },
    danger: {
      backgroundColor: '#dc3545',
      hover: { backgroundColor: '#bb2d3b' },
    },
    success: {
      backgroundColor: '#198754',
      hover: { backgroundColor: '#157347' },
    },
  })
  .sizes({
    sm: { fontSize: 14, paddingX: 12, paddingY: 6 },
    md: { fontSize: 16, paddingX: 16, paddingY: 8 },
    lg: { fontSize: 18, paddingX: 20, paddingY: 10 },
  })
```

```tsx
// Named props
<Button state="danger" size="lg" label="Delete" />

// Boolean shorthand (when useBooleans is enabled)
<Button danger lg label="Delete" />
```

## Core Concepts

### Dimensions

A dimension is a named axis of style variation. The factory ships with four defaults:

| Dimension | Prop name | Multi | Example |
| --------- | --------- | ----- | ------- |
| `states` | `state` | no | `primary`, `danger`, `success` |
| `sizes` | `size` | no | `sm`, `md`, `lg` |
| `variants` | `variant` | no | `outlined`, `filled` |
| `multiple` | — | yes | `rounded`, `shadow` |

Each dimension creates a chain method (`.states()`, `.sizes()`, etc.) and a corresponding prop on the component.

**Multi dimensions** allow multiple values at once: `<Button rounded shadow>`.

### Theme Object

The `.theme()` method defines base CSS property values. Values are processed by `@vitus-labs/unistyle` — numbers convert to rem, shorthand properties expand automatically.

Pseudo-state keys nest directly in the theme object:

```tsx
.theme({
  color: '#333',
  fontSize: 16,
  hover: { color: '#000' },
  focus: { outline: '2px solid blue' },
  active: { transform: 'scale(0.98)' },
})
```

### Styles Function

The `.styles()` method defines the styled-components template that receives the computed theme:

```tsx
.styles((css) => css`
  ${({ $rocketstyle, $rocketstate }) => {
    // $rocketstyle — computed theme values (base + active dimension values merged)
    // $rocketstate — { hover, focus, pressed, active, disabled, pseudo }
    return css`...`
  }}
`)
```

## API

### rocketstyle(options?)

Factory initializer. Returns a function that accepts component configuration.

```tsx
const factory = rocketstyle({
  dimensions: { /* custom dimensions */ },
  useBooleans: true,
})

const Component = factory({
  name: 'ComponentName',
  component: BaseComponent,
})
```

### .attrs(props | callback, options?)

Same API as `@vitus-labs/attrs`. Define default props with optional priority and filter.

```tsx
Button.attrs({ tag: 'button', role: 'button' })
Button.attrs((props) => ({ 'aria-label': props.label }))
```

### .theme(values | callback)

Base theme values applied to every instance.

```tsx
// Object form
Button.theme({
  fontSize: 16,
  color: '#fff',
  hover: { opacity: 0.9 },
})

// Callback form — receives the theme context and mode
Button.theme((theme, mode, css) => ({
  fontSize: 16,
  color: mode === 'dark' ? '#fff' : '#333',
}))
```

### .states() / .sizes() / .variants() / .multiple()

Define values for each dimension. Each key becomes a selectable option.

```tsx
Button.states({
  primary: { backgroundColor: '#0d6efd' },
  danger: { backgroundColor: '#dc3545' },
})

Button.sizes({
  sm: { fontSize: 14, paddingX: 8 },
  lg: { fontSize: 18, paddingX: 20 },
})

// Multi dimension — multiple can be active at once
Button.multiple({
  rounded: { borderRadius: 999 },
  shadow: { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
})
```

Dimension methods also accept callbacks:

```tsx
Button.states((theme, mode, css) => ({
  primary: { backgroundColor: theme.colors?.primary ?? '#0d6efd' },
}))
```

### .styles(callback)

Define the styled-components CSS template.

```tsx
Button.styles((css) => css`
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  ${({ $rocketstyle }) =>
    makeItResponsive({ theme: $rocketstyle, styles, css })
  }
`)
```

### .config(options)

Reconfigure the component.

```tsx
Button.config({
  name: 'PrimaryButton',    // change displayName
  component: NewBase,        // swap base component
  provider: true,            // make this component a context provider
  consumer: (ctx) => ...,   // consume parent component context
  inversed: true,            // invert theme mode
  DEBUG: true,               // enable debug logging
})
```

### .compose(hocs) / .statics(metadata)

Same API as `@vitus-labs/attrs`:

```tsx
Button.compose({ withTracking: trackingHoc })
Button.statics({ category: 'action' })

Button.meta.category // => 'action'
```

### isRocketComponent(value)

Runtime type guard.

```tsx
import { isRocketComponent } from '@vitus-labs/rocketstyle'

isRocketComponent(Button) // => true
```

## Custom Dimensions

Define your own dimensions by passing them to the factory:

```tsx
const rocketButton = rocketstyle({
  dimensions: {
    intent: 'intent',                    // prop: intent="primary"
    size: 'size',                        // prop: size="lg"
    appearance: {
      propName: 'appearance',
      multi: true,                       // allows multiple: <Button rounded outlined>
    },
  },
})
```

This creates `.intent()`, `.size()`, and `.appearance()` chain methods.

## Provider / Consumer

Propagate parent component state to children through context.

```tsx
// Parent provides its state
const ButtonGroup = Button.config({ provider: true })

// Child consumes parent state
const ButtonIcon = rocketstyle()({
  name: 'ButtonIcon',
  component: Element,
})
  .config({
    consumer: (ctx) => ctx<typeof ButtonGroup>(({ pseudo }) => ({
      state: pseudo.hover ? 'active' : 'default',
    })),
  })
  .states({
    default: { color: '#666' },
    active: { color: '#fff' },
  })

// Icon reacts to parent's hover state
<ButtonGroup state="primary">
  <ButtonIcon />
  <span>Label</span>
</ButtonGroup>
```

## Light / Dark Mode

Theme callbacks receive a `mode` parameter:

```tsx
Button.theme((theme, mode) => ({
  color: mode === 'dark' ? '#fff' : '#1a1a1a',
  backgroundColor: mode === 'dark' ? '#333' : '#fff',
}))
```

Use `inversed: true` in `.config()` to flip the mode for a component subtree.

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| @vitus-labs/core | * |

## License

MIT
