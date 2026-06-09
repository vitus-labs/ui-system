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
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/vitus-labs/ui-system/main/packages/connector-styler/assets/logo-dark.svg">
    <img alt="@vitus-labs/connector-styler" src="https://raw.githubusercontent.com/vitus-labs/ui-system/main/packages/connector-styler/assets/logo-light.svg" width="96" height="96">
  </picture>
</p>
<!-- LOGO:END -->

# @vitus-labs/connector-styler

CSS-in-JS connector for `@vitus-labs/styler` — the recommended connector for web applications.

[![npm](https://img.shields.io/npm/v/@vitus-labs/connector-styler)](https://www.npmjs.com/package/@vitus-labs/connector-styler)
[![license](https://img.shields.io/npm/l/@vitus-labs/connector-styler)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

This package re-exports `css`, `styled`, `keyframes`, `createGlobalStyle`, `useTheme`, and `ThemeProvider` from `@vitus-labs/styler` in the shape expected by `@vitus-labs/core`'s `init()` function.

## Installation

```bash
npm install @vitus-labs/connector-styler @vitus-labs/styler
```

## Usage

```tsx
import { init } from '@vitus-labs/core'
import connector from '@vitus-labs/connector-styler'

init({
  ...connector,
  component: 'div',
  textComponent: 'span',
})
```

## Exports

| Export | Source |
| ------ | ------ |
| `css` | `@vitus-labs/styler` |
| `styled` | `@vitus-labs/styler` |
| `keyframes` | `@vitus-labs/styler` |
| `createGlobalStyle` | `@vitus-labs/styler` |
| `useTheme` | `@vitus-labs/styler` |
| `useCSS` | `@vitus-labs/styler` |
| `provider` | `ThemeProvider` from `@vitus-labs/styler` |

The default export spreads all of the above for convenient use with `init()`.

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| @vitus-labs/styler | * |
| react | >= 19 |

## License

MIT
