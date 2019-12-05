<div align="center">
  <a href="https://vitus-labs.github.io/elements/">
    <img src="https://raw.githubusercontent.com/vitus-labs/vitus-labs/master/packages/elements/logo.png" alt="Elements" height="150" />
  </a>
</div>

# Getting Started

Elements are a package of patterns which should cover very
common and frequent use-cases, so you don't have to repeat yourself
again and again.

Elements package uses React and styled-components.
And core utilities from `@vitus-labs/core`.

## Motivation

The goal is to cover many repeatable use-cases of writing code
and make banch of components which would solve this. You shouldn't
focus on some specifics of CSS or thinking about HTML validation
or so. The goal is to make configurable components so you can focus
on your goals and business value.

### Components available in the package

### Element

`Element` is a simple component for aligning simple elements
vertically/horizontally. This might be helpful adding some
additional elements like loading icon to button, input
element symbol or validation element. Which leads to repeatable
patterns. All these things and much more can be covered by this
component.

### List & Iterator

Another usecase is rendering simple lists of data. If you
are tired of using `map` function again and again `Iterator`
or `List`components are here to cover it for you.

### Overlay

`Overlay` is an utility function which might help you building
modal windows, dropdowns, tooltips, popovers etc. It's quite
configurable so you can align elements the way you like without
any extra effort.

### Portal

`Portal` is just a common Reat Portal component to be used to append
any elements to DOM.

### Text

Simple component for paragraphs or any inline text element like `strong`,
`small` etc.

### Util

It's a component which can be used to wrap another component and returns
its child component extended. It can be used for extending styles without
rendering more elements.

## Installation

You can install it with your preferred tool (`yarn` or `npm`).

```powershell
# with yarn
yarn add @vitus-labs/elements

# or with npm
npm install @vitus-labs/elements --save
```

## Dependencies

Elements depends on the following packages which need to be installed as well.

| Package           | version |
| ----------------- | ------- |
| react             | >= 16.7 |
| @vitus-labs/core  | >= 0.2  |
| styled-components | >= 4.0  |

Styled-components are a peer dependency of `@vitus-labs/core`.

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
