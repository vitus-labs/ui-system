<div align="center">
  <a href="https://vitus-labs.com/docs/ui-system/elements">
    <img src="https://github.com/vitus-labs/ui-system/blob/master/packages/elements/logo.png" alt="Elements" height="150" />
  </a>
</div>

# Getting Started

Elements are a package of patterns that should cover very common
and frequent use-cases, so you don't have to repeat yourself again
and again. Elements are a package of patterns that should cover very
common and frequent use-cases, so you don't have to repeat yourself
again and again.

Full documentation is at [https:vitus-labs.com/](https://vitus-labs.com/docs/ui-system/elements)

## Motivation

The goal is to cover many repeatable use-cases of writing code and make
a bunch of components that would solve this. You shouldn't focus on some
specifics of CSS or thinking about HTML validation or so. The goal is to
make configurable components so you can focus on your goals and business
value.

### Components available in the package

### Element

**Element** is a simple component for aligning simple elements vertically/horizontally.
This might help add some additional elements like loading icon to button, input
element symbol, or validation element. Which leads to repeatable patterns.
All these things and much more can be covered by this component.

### List

Another use case is rendering simple lists of data. If you are tired of using
the `map` function again and again this component is here to cover it for you.

### Text

Simple component for s or any inline text element like strong, small and so on.

### Overlay

**Overlay** is a component that might help you building modal windows, dropdowns,
tooltips, popovers, etc. It's quite configurable so you can align elements
the way you like without any extra effort.

### Portal

**Portal** is just a common Reat Portal component to be used to append any elements to DOM.

## Installation

You can install it with your preferred tool (`yarn` or `npm`).

```powershell
# with yarn
yarn add @vitus-labs/elements @vitus-labs/core

# or with npm
npm install @vitus-labs/elements @vitus-labs/core
```

## Dependencies

Elements depends on the following packages which need to be installed as well.

| Package          | version      |
| ---------------- | ------------ |
| react            | >= 16.7      |
| @vitus-labs/core | same version |

## Code examples

```jsx
import React from 'react'
import { Element } from '@vitus-labs/elements'
import Loading from './any-react-component'

const Element = () => (
  <Element
    tag="button"
    label="This is a label"
    contentAlignX="left"
    contentAlignY="center"
    beforeContent={Loading}
  />
)
```

```jsx
import React from 'react'
import { List, Element } from '@vitus-labs/elements'

const data = [{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }]
return <List data={data} component={Element} />
```

It's cool, right? So, check out more examples and happy coding!
