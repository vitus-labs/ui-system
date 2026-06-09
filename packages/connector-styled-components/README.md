<!-- LOGO:BEGIN -->
<p align="left">
  <a href="https://github.com/vitus-labs/ui-system">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/vitus-labs/ui-system/main/.github/assets/vitus-labs-mark-dark.svg">
      <img alt="vitus·labs" src="https://raw.githubusercontent.com/vitus-labs/ui-system/main/.github/assets/vitus-labs-mark-light.svg" width="48" height="48">
    </picture>
  </a>
  &nbsp;&nbsp;&nbsp;
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/vitus-labs/ui-system/main/packages/connector-styled-components/assets/logo-dark.svg">
    <img alt="@vitus-labs/connector-styled-components" src="https://raw.githubusercontent.com/vitus-labs/ui-system/main/packages/connector-styled-components/assets/logo-light.svg" width="96" height="96">
  </picture>
</p>
<!-- LOGO:END -->

# @vitus-labs/connector-styled-components

CSS-in-JS connector for styled-components — bridges `styled-components` to the Vitus Labs component system.

[![npm](https://img.shields.io/npm/v/@vitus-labs/connector-styled-components)](https://www.npmjs.com/package/@vitus-labs/connector-styled-components)
[![license](https://img.shields.io/npm/l/@vitus-labs/connector-styled-components)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

Re-exports `css`, `styled`, `keyframes`, `createGlobalStyle`, `useTheme`, and `ThemeProvider` from `styled-components` in the shape expected by `@vitus-labs/core`'s `init()` function.

## Installation

```bash
npm install @vitus-labs/connector-styled-components styled-components
```

## Usage

```tsx
import { init } from '@vitus-labs/core'
import connector from '@vitus-labs/connector-styled-components'

init({
  ...connector,
  component: 'div',
  textComponent: 'span',
})
```

## Exports

| Export | Source |
| ------ | ------ |
| `css` | `styled-components` |
| `styled` | `styled-components` |
| `keyframes` | `styled-components` |
| `createGlobalStyle` | `styled-components` |
| `useTheme` | `styled-components` |
| `provider` | `ThemeProvider` from `styled-components` |

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| styled-components | >= 6 |
| react | >= 19 |

## License

MIT
