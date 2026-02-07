# @vitus-labs/coolgrid

Responsive grid system for React and styled-components.

[![npm](https://img.shields.io/npm/v/@vitus-labs/coolgrid)](https://www.npmjs.com/package/@vitus-labs/coolgrid)
[![license](https://img.shields.io/npm/l/@vitus-labs/coolgrid)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

Bootstrap-inspired Container / Row / Col grid with context-cascading configuration. Define breakpoints, column count, gaps, and gutters at any level — children inherit automatically. Every value is responsive.

## Features

- **Familiar mental model** — Container, Row, Col just like Bootstrap
- **Context cascading** — set columns, gaps, and gutters at Container level, inherited by all Rows and Cols
- **Responsive values** — single value, mobile-first array, or breakpoint object on every prop
- **Custom breakpoints** — name and size them however you want
- **Custom column counts** — 12, 24, 5 — any number
- **Custom components** — swap Container, Row, or Col underlying elements
- **Default Bootstrap theme** — included and ready to use

## Installation

```bash
npm install @vitus-labs/coolgrid @vitus-labs/core @vitus-labs/unistyle styled-components
```

## Quick Start

```tsx
import { Container, Row, Col, Provider, theme } from '@vitus-labs/coolgrid'

const App = () => (
  <Provider theme={theme}>
    <Container>
      <Row>
        <Col size={8}>Main content</Col>
        <Col size={4}>Sidebar</Col>
      </Row>
    </Container>
  </Provider>
)
```

## Components

### Container

Outermost grid boundary. Sets max-width and provides configuration context to descendants.

```tsx
<Container
  columns={12}
  gap={16}
  gutter={24}
  padding={16}
>
  <Row>...</Row>
</Container>
```

| Prop | Type | Description |
| ---- | ---- | ----------- |
| columns | `number` | Number of grid columns (default: 12) |
| gap | `number` | Space between columns |
| gutter | `number` | Outer gutter (negative margin offset on Row) |
| padding | `number` | Column inner padding |
| width | `value \| function` | Override container max-width |
| component | `ComponentType` | Custom root element |
| css | `ExtendCss` | Extend container styling |
| contentAlignX | `AlignX` | Horizontal alignment of columns |

All configuration props cascade to Row and Col through context.

### Row

Flex wrapper with column management. Inherits Container config and can override it.

```tsx
<Row
  size={{ xs: 12, md: 6 }}
  contentAlignX="center"
>
  <Col>Column 1</Col>
  <Col>Column 2</Col>
</Row>
```

Setting `size` on Row applies it to all Cols inside:

```tsx
// All columns are 6 of 12
<Row size={6}>
  <Col>Half</Col>
  <Col>Half</Col>
</Row>
```

| Prop | Type | Description |
| ---- | ---- | ----------- |
| size | `number` | Default column size for all Cols inside |
| component | `ComponentType` | Custom row element |
| css | `ExtendCss` | Extend row styling |
| contentAlignX | `AlignX` | Override horizontal alignment |

### Col

Individual column. Width is calculated as a fraction of total columns.

```tsx
// Fixed size
<Col size={4}>1/3 width</Col>

// Responsive size
<Col size={{ xs: 12, sm: 6, lg: 4 }}>
  Full on mobile, half on small, third on large
</Col>

// Hidden on mobile
<Col size={{ xs: 0, md: 6 }}>Hidden on xs</Col>
```

| Prop | Type | Description |
| ---- | ---- | ----------- |
| size | `number` | Column span (e.g. 4 of 12) |
| padding | `number` | Override column inner padding |
| component | `ComponentType` | Custom column element |
| css | `ExtendCss` | Extend column styling |

## Configuration

### Custom Breakpoints

```tsx
<Provider theme={{
  rootSize: 16,
  breakpoints: {
    phone: 0,
    tablet: 600,
    desktop: 1024,
    wide: 1440,
  },
}}>
```

### Custom Column Count

```tsx
<Container columns={24}>
  <Row>
    <Col size={16}>Two thirds</Col>
    <Col size={8}>One third</Col>
  </Row>
</Container>
```

### Custom Container Widths

```tsx
<Provider theme={{
  rootSize: 16,
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
  grid: {
    columns: 12,
    container: {
      xs: '100%',
      sm: 540,
      md: 720,
      lg: 960,
      xl: 1140,
    },
  },
}}>
```

### Context Cascading

Configuration flows from Container through Row to Col via React context:

```text
Container (columns: 12, gap: 16)
  └─ Row (inherits columns, gap)
       └─ Col (inherits columns, gap, calculates width)
```

Props set on a child override the inherited value for that level and below.

## Default Theme

The included `theme` export provides Bootstrap 4 defaults:

```tsx
{
  rootSize: 16,
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
  grid: {
    columns: 12,
    container: { xs: '100%', sm: 540, md: 720, lg: 960, xl: 1140 },
  },
}
```

## Responsive Values

All numeric props support three formats:

```tsx
// Single value
<Col size={6} />

// Array (mobile-first, by breakpoint position)
<Col size={[12, 6, 4]} />

// Object (explicit breakpoints)
<Col size={{ xs: 12, md: 6, lg: 4 }} />
```

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| @vitus-labs/core | * |
| @vitus-labs/unistyle | * |
| styled-components | >= 6 |

## License

MIT
