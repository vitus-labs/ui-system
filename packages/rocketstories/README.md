# @vitus-labs/rocketstories

Auto-generated Storybook stories from rocketstyle components.

[![npm](https://img.shields.io/npm/v/@vitus-labs/rocketstories)](https://www.npmjs.com/package/@vitus-labs/rocketstories)
[![license](https://img.shields.io/npm/l/@vitus-labs/rocketstories)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

One factory call gives you a complete Storybook setup — default story, dimension showcases, custom renders, and list views. Auto-detects rocketstyle dimensions, generates controls for pseudo-states, and supports configurable layouts. Also works with plain React components.

## Features

- **Zero-boilerplate stories** — `.main()`, `.dimension()`, `.render()`, `.list()` output methods
- **Auto dimension detection** — reads rocketstyle component dimensions and generates showcases
- **Storybook controls** — auto-generated arg table with pseudo-state toggles
- **Configurable layout** — direction, alignment, gap for story rendering
- **Immutable chaining** — `.attrs()`, `.controls()`, `.storyOptions()`, `.config()`
- **Works with any component** — rocketstyle components get enhanced features, plain components work too

## Installation

```bash
npm install @vitus-labs/rocketstories
```

## Quick Start

```tsx
// Button.stories.tsx
import { init } from '@vitus-labs/rocketstories'
import Button from './Button'

const storyOf = init({ decorators: [ThemeDecorator] })
const stories = storyOf(Button).attrs({ label: 'Click me' })

export default stories.init()

export const Default = stories.main()
export const States = stories.dimension('states')
export const Sizes = stories
  .storyOptions({ direction: 'inline', gap: 24 })
  .dimension('sizes')
```

## API

### rocketstories(component, options?)

One-shot factory. Creates a story builder for the given component.

```tsx
import { rocketstories } from '@vitus-labs/rocketstories'

const stories = rocketstories(Button, {
  storyOptions: { gap: 24, direction: 'rows' },
  decorators: [ThemeDecorator],
})
```

### init(options?)

Curried factory for shared configuration across multiple components.

```tsx
import { init } from '@vitus-labs/rocketstories'

const storyOf = init({
  storyOptions: { gap: 16, direction: 'rows', alignY: 'top' },
  decorators: [ThemeDecorator],
})

// Reuse for multiple components
const buttonStories = storyOf(Button)
const inputStories = storyOf(Input)
```

### Output Methods

#### .init()

Returns the Storybook default export (title, component, argTypes).

```tsx
export default stories.init()
```

#### .main()

Renders the component in its default state with Storybook controls.

```tsx
export const Default = stories.main()
```

#### .dimension(name, options?)

Renders all values of a specific dimension side by side. Only available for rocketstyle components.

```tsx
export const States = stories.dimension('states')
export const Sizes = stories.dimension('sizes')

// Ignore specific values
export const States = stories.dimension('states', { ignore: ['default'] })
```

#### .render(callback)

Custom render function for full control.

```tsx
export const Custom = stories.render((props) => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Button {...props} state="primary" label="Primary" />
    <Button {...props} state="danger" label="Danger" />
  </div>
))
```

#### .list(options)

Renders a list of component instances using `@vitus-labs/elements` List.

```tsx
export const ItemList = stories.list({
  data: ['Apple', 'Banana', 'Cherry'],
  valueName: 'label',
})
```

### Chaining Methods

All chaining methods return a new builder instance.

#### .attrs(props)

Set default props for all stories.

```tsx
stories.attrs({ label: 'Button', size: 'md' })
```

#### .controls(config)

Define Storybook arg table controls.

```tsx
stories.controls({
  label: { type: 'text', value: 'Click me' },
  disabled: { type: 'boolean', value: false },
  size: { type: 'select', options: ['sm', 'md', 'lg'], value: 'md' },
})
```

#### .storyOptions(options)

Configure story layout rendering.

```tsx
stories.storyOptions({
  direction: 'inline',  // 'inline' | 'rows'
  alignX: 'left',       // 'left' | 'center' | 'right' | 'spaceBetween'
  alignY: 'center',     // 'top' | 'center' | 'bottom' | 'spaceBetween'
  gap: 24,              // spacing between items
  pseudo: true,         // show pseudo-state controls (hover, focus, etc.)
})
```

#### .config(options)

Update general configuration.

```tsx
stories.config({
  name: 'CustomStoryName',
  decorators: [NewDecorator],
})
```

#### .replaceComponent(component)

Swap the component being showcased.

```tsx
stories.replaceComponent(EnhancedButton)
```

#### .decorators(decorators)

Add Storybook decorators.

```tsx
stories.decorators([ThemeDecorator, LayoutDecorator])
```

## Rocketstyle Integration

For rocketstyle components, rocketstories automatically:

1. Detects all dimensions via `getStaticDimensions()`
2. Generates controls for pseudo-states (hover, focus, pressed, active)
3. Groups rocketstyle-specific controls under "Rocketstyle (Vitus-Labs)"
4. Enables `.dimension()` stories for each registered dimension

## Plain React Components

Non-rocketstyle components work with `.main()`, `.render()`, and `.list()`. The `.dimension()` method returns null for plain components.

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| @storybook/react | * |
| @vitus-labs/core | * |
| @vitus-labs/rocketstyle | * |
| @vitus-labs/unistyle | * |

## License

MIT
