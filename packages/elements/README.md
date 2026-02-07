# @vitus-labs/elements

Layout primitives for React with responsive props.

[![npm](https://img.shields.io/npm/v/@vitus-labs/elements)](https://www.npmjs.com/package/@vitus-labs/elements)
[![license](https://img.shields.io/npm/l/@vitus-labs/elements)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

Five composable components for building buttons, cards, lists, dropdowns, tooltips, and modals. Every layout prop is responsive — pass a single value, a mobile-first array, or a breakpoint object.

## Features

- **Element** — three-section flex layout (beforeContent / content / afterContent)
- **Text** — semantic text rendering with auto paragraph wrapping
- **List** — data-driven rendering with positional metadata (first, last, odd, even)
- **Overlay** — portal-based positioning for dropdowns, tooltips, and modals with auto-flip
- **Portal** — React Portal wrapper for DOM appending
- **Util** — non-rendering utility for injecting className and style
- **Responsive everything** — single value, array, or breakpoint object on every layout prop
- **Selection state** — `withActiveState` HOC for single/multi item selection on List

## Installation

```bash
npm install @vitus-labs/elements @vitus-labs/core @vitus-labs/unistyle styled-components
```

## Components

### Element

The core layout primitive. Renders a three-section flex container with optional beforeContent and afterContent slots around the main content.

```tsx
import { Element } from '@vitus-labs/elements'

// Simple button with icon before and chevron after
<Element
  tag="button"
  beforeContent={<Icon name="star" />}
  afterContent={<Icon name="chevron-right" />}
  direction="inline"
  alignX="center"
  alignY="center"
  gap={8}
>
  Click me
</Element>
```

When only content is present (no beforeContent/afterContent), Element optimizes by skipping the inner wrapper layer.

**Content props** (rendered in priority order: children > content > label):

| Prop | Type | Description |
| ---- | ---- | ----------- |
| children | `ReactNode` | Standard React children |
| content | `ReactNode` | Alternative to children |
| label | `ReactNode` | Alternative to children/content |
| beforeContent | `ReactNode` | Content rendered before the main slot |
| afterContent | `ReactNode` | Content rendered after the main slot |

**Layout props** (all responsive):

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| tag | `HTMLTags` | `'div'` | HTML element tag |
| block | `boolean` | — | `flex` vs `inline-flex` |
| direction | `Direction` | `'inline'` | `'inline'` \| `'rows'` \| `'reverseInline'` \| `'reverseRows'` |
| alignX | `AlignX` | `'left'` | Horizontal alignment |
| alignY | `AlignY` | `'center'` | Vertical alignment |
| gap | `number` | — | Gap between content sections |
| equalCols | `boolean` | — | Equal width/height for before/after |

Each section (content, beforeContent, afterContent) has its own direction, alignX, and alignY props prefixed with the section name:

```tsx
<Element
  contentDirection="rows"
  contentAlignX="center"
  beforeContentAlignY="top"
  afterContentDirection="inline"
/>
```

**CSS extension props:**

| Prop | Description |
| ---- | ----------- |
| css | Extend root wrapper styling |
| contentCss | Extend content wrapper styling |
| beforeContentCss | Extend beforeContent wrapper styling |
| afterContentCss | Extend afterContent wrapper styling |

CSS props accept strings, template literals, `css` tagged templates, or callbacks.

### Text

Semantic text component with optional paragraph auto-wrapping.

```tsx
import { Text } from '@vitus-labs/elements'

<Text tag="h1">Heading</Text>
<Text paragraph>This renders as a p tag.</Text>
<Text tag="strong" label="Bold text" />
```

| Prop | Type | Description |
| ---- | ---- | ----------- |
| tag | `HTMLTextTags` | `'h1'`–`'h6'`, `'p'`, `'span'`, `'strong'`, `'em'`, etc. |
| paragraph | `boolean` | Shorthand for `tag="p"` |
| children / label | `ReactNode` | Text content |
| css | `ExtendCss` | Extend styling |

### List

Data-driven list renderer with Iterator pattern.

```tsx
import { List, Element } from '@vitus-labs/elements'

// Simple string data
<List
  component={Element}
  data={['Apple', 'Banana', 'Cherry']}
  valueName="label"
/>

// Object data with positional metadata
<List
  component={ListItem}
  data={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]}
  itemKey="id"
  itemProps={(item, { first, last, odd, even, index }) => ({
    highlighted: first,
    separator: !last,
  })}
/>

// With root Element wrapper
<List
  rootElement
  direction="rows"
  gap={8}
  component={Card}
  data={items}
/>
```

| Prop | Type | Description |
| ---- | ---- | ----------- |
| data | `Array` | Array of strings, numbers, or objects |
| component | `ComponentType` | Component to render for each item |
| valueName | `string` | Prop name for scalar values (default: `'children'`) |
| itemKey | `string \| function` | Key extraction for list items |
| itemProps | `object \| function` | Extra props injected into each item |
| wrapComponent | `ComponentType` | Wrapper around each item |
| rootElement | `boolean` | Wrap list in an Element (enables direction, gap, etc.) |

**Positional metadata** passed to `itemProps` callback:

`index`, `first`, `last`, `odd`, `even`, `position` (1-based)

### withActiveState

HOC that adds selection state management to List.

```tsx
import { List, withActiveState } from '@vitus-labs/elements'

const SelectableList = withActiveState(List)

<SelectableList
  type="single"
  component={ListItem}
  data={items}
  activeItems="item-1"
/>

<SelectableList
  type="multi"
  component={ListItem}
  data={items}
  activeItems={['item-1', 'item-3']}
  activeItemRequired
/>
```

Each item receives: `active`, `handleItemActive`, `setItemActive`, `unsetItemActive`, `toggleItemActive`.

### Overlay

Portal-based overlay with intelligent positioning and event management.

```tsx
import { Overlay } from '@vitus-labs/elements'

// Dropdown
<Overlay
  openOn="click"
  closeOn="clickOutsideContent"
  align="bottom"
  alignX="left"
  trigger={<Button label="Open menu" />}
>
  <DropdownMenu />
</Overlay>

// Tooltip
<Overlay
  openOn="hover"
  closeOn="hover"
  align="top"
  alignX="center"
  offsetY={8}
  trigger={<span>Hover me</span>}
>
  <Tooltip>Helpful text</Tooltip>
</Overlay>
```

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| trigger | `ReactNode \| function` | — | The triggering element |
| children | `ReactNode \| function` | — | Overlay content |
| openOn | `'click' \| 'hover' \| 'manual'` | `'click'` | How to open |
| closeOn | `'click' \| 'clickOnTrigger' \| 'clickOutsideContent' \| 'hover' \| 'manual'` | `'click'` | How to close |
| type | `'dropdown' \| 'tooltip' \| 'popover' \| 'modal' \| 'custom'` | — | Positioning preset |
| align | `'top' \| 'bottom' \| 'left' \| 'right'` | — | Primary alignment relative to trigger |
| alignX | `'left' \| 'center' \| 'right'` | — | Horizontal alignment |
| alignY | `'top' \| 'center' \| 'bottom'` | — | Vertical alignment |
| offsetX / offsetY | `number` | `0` | Margin from trigger |
| closeOnEsc | `boolean` | `true` | Close on Escape key |
| disabled | `boolean` | `false` | Disable open/close |
| onOpen / onClose | `() => void` | — | Lifecycle callbacks |

Overlay auto-flips when content hits the viewport edge. Positioning is throttled for performance.

When trigger or children are render functions, they receive callbacks:

```tsx
<Overlay
  openOn="manual"
  trigger={({ showContent, active, ref }) => (
    <button ref={ref} onClick={showContent}>
      {active ? 'Close' : 'Open'}
    </button>
  )}
>
  {({ hideContent, align, ref }) => (
    <div ref={ref}>
      <button onClick={hideContent}>Close</button>
    </div>
  )}
</Overlay>
```

### Portal

React Portal wrapper for appending content to a specific DOM location.

```tsx
import { Portal } from '@vitus-labs/elements'

<Portal>
  <div>Rendered at document.body</div>
</Portal>

<Portal DOMLocation={document.getElementById('modal-root')}>
  <div>Rendered at #modal-root</div>
</Portal>
```

### Util

Non-rendering utility that injects className and style into its child.

```tsx
import { Util } from '@vitus-labs/elements'

<Util className="custom-class" style={{ color: 'red' }}>
  <div>Receives className and style props</div>
</Util>
```

## Responsive Values

Every layout prop (direction, alignX, alignY, gap, block, equalCols) supports three formats:

```tsx
// Single value — all breakpoints
<Element direction="inline" />

// Array — mobile-first, maps to breakpoints by position
<Element direction={['rows', 'inline']} />

// Object — explicit breakpoints
<Element direction={{ xs: 'rows', md: 'inline', lg: 'inline' }} />
```

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| react-dom | >= 19 |
| @vitus-labs/core | * |
| @vitus-labs/unistyle | * |
| styled-components | >= 6 |

## License

MIT
