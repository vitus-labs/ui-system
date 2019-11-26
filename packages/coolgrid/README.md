<div align="center">
  <a href="https://vitus-labs.github.io/coolgrid/">
    <img src="https://raw.githubusercontent.com/vitus-labs/vitus/labs/master/packages/coolgrid/logo.png" alt="Coolgrid" height="150">
  </a>
</div>

Coolgrid is ultra flexible and extensible grid system for React based on styled-components and heavily inspired by Bootstrap Grid system.

## Documentation

Documentation can be found [here](https://vitus-labs.github.io/coolgrid/).

# Getting Started

Coolgrid is ultra-flexible and extensible grid system for React
based on styled-components and heavily inspired by
Bootstrap Grid System.

Coolgrid uses React and styled-components.

## Motivation

There are several grid solutions but none of them have fit my
needs so far. They were not enough extensible. With Coolgrid
you can do basically whatever you want while writing less code
and have fewer DOM elements in your application.

### What are the advantages of using coolgrid?

1. **fewer DOM elements** - each of the available components supports
   the property component, which accepts any valid HTML tag. So
   having a valid document structure might need fewer elements in
   the DOM. Or you can pass any valid React component and do much
   more!

2. **Breakpoint keys** - there is no strict policy about it. Feel
   free to define as many breakpoints as you like. And that's not
   all. Feel free to name them the way you like. Do you prefer
   Bootstrap like naming xs, sm, md, lg, and xl? Or do you rather
   prefer more descriptive names like phone, tablet, desktop (or xsmall,
   small, medium, large, xlarge)?

3. **Breakpoint values** - for defining the size of viewports,
   you can use any value. Just a number, you can use pixels,
   percentages, whatever you like. You should just know that
   number automatically converts to em units calculated from
   rootSize defined in theme (and fallbacks to the value of 16).
   The same applies to pixels.

4. **Container width** - here applies the same rules as for
   breakpoints. There is just one more requirement. The keys defined
   for Container must be the same as the names of breakpoints.

5. **Context** - Define behavior on Container or Row for all
   Cols inside. Coolgrid uses context on the background so you can
   change the whole grid by changing just one line property.

6. **A configurable number of columns** - Bootstrap grid uses
   by default 12 columns. Coolgrid is highly configurable, so
   you can define as many columns as you like. Do you need 5 column
   grid? No problem!

7. **Customizable gaps between columns** - Feel free to customize
   the size of gaps for your grid. No gaps, normal gaps, whatever
   your design needs.

8. **Customizable paddings inside Cols** - You can customize paddings as well.

## Installation

You can install ii with your preferred tool (`yarn` or `npm`).

```powershell
# with yarn
yarn add @vitus-labs/coolgrid

# or with npm
npm install @vitus-labs/coolgrid --save
```

## Dependencies

Coolgrid depends on the following packages which need to be installed as well.

| Package           | version |
| ----------------- | ------- |
| react             | >= 16.7 |
| @vitus-labs/core  | >= 0.2  |
| styled-components | >= 4.0  |

Styled-components are a peer dependency of `@vitus-labs/core`.

## ThemeProvider

Don't forget to add coolgrid theme config into your `ThemeProvider`.

```jsx
import { ThemeProvider } from 'styled-components'
import { theme } from 'coolgrid'
// you can import default bootstrap theme settings or create yours.
;<ThemeProvider
  theme={{
    ...theme
    /* ...your theme */
  }}
>
  {/* ...your components */}
</ThemeProvider>
```

Alternatively you can put it directly to the root of theme object:

```jsx
// you can import default bootstrap theme settings or create yours.

<ThemeProvider
  theme={{
    // default bootstrap configuration example
    rootSize: 16, // is being used to convert viewport px to em units
    columns: 12,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200
    },
    grid: {
      container: {
        xs: '100%',
        sm: 540,
        md: 720,
        lg: 960,
        xl: 1140
      }
    }
    /* ...your theme */
  }}
>
  {/* ...your components */}
</ThemeProvider>
```

## Code examples

```jsx
import React from 'react'
import { Container, Row, Col } from 'coolgrid'

const Element = () => (
  <Container>
    <Row>
      <Col size={3}>Column 1</Col>
      <Col size={{ xs: 12, sm: 6, md: 3 }}>Column 2</Col>
      <Col size={{ xs: 9, md: 3 }}>Column 3</Col>
      <Col size={3}>Column 4</Col>
    </Row>
  </Container>
)
```

You can define Col properties in Container or Row component.
It uses context in the background. It means you can even
write less code.

```jsx
import React from 'react'
import { Container, Row, Col } from 'coolgrid'

const Element = () => (
  <Container>
    <Row size={{ xs: 12, sm: 6, md: 3 }}>
      <Col>Column 1</Col>
      <Col>Column 2</Col>
      <Col>Column 3</Col>
      <Col>Column 4</Col>
    </Row>
  </Container>
)
```

It's cool, right? So, check out more examples and happy coding!
