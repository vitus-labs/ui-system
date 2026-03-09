# @vitus-labs/connector-emotion

CSS-in-JS connector for Emotion — bridges `@emotion/react` and `@emotion/styled` to the Vitus Labs component system.

[![npm](https://img.shields.io/npm/v/@vitus-labs/connector-emotion)](https://www.npmjs.com/package/@vitus-labs/connector-emotion)
[![license](https://img.shields.io/npm/l/@vitus-labs/connector-emotion)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

Adapts Emotion's API to match the `CSSEngineConnector` interface expected by `@vitus-labs/core`. The `css` export wraps Emotion's template handling to support the same composition patterns used by the styler and styled-components connectors. `createGlobalStyle` wraps Emotion's `<Global>` component.

## Installation

```bash
npm install @vitus-labs/connector-emotion @emotion/react @emotion/styled
```

## Usage

```tsx
import { init } from '@vitus-labs/core'
import connector from '@vitus-labs/connector-emotion'

init({
  ...connector,
  component: 'div',
  textComponent: 'span',
})
```

## Exports

| Export | Description |
| ------ | ----------- |
| `css` | Custom adapter — returns static strings or `(props) => string` functions |
| `styled` | Re-export of `@emotion/styled` |
| `keyframes` | Re-export of `@emotion/react` keyframes |
| `createGlobalStyle` | Wrapper component using Emotion's `<Global>` |
| `useTheme` | Re-export of `@emotion/react` useTheme |
| `provider` | Emotion's `ThemeProvider` |

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| @emotion/react | >= 11 |
| @emotion/styled | >= 11 |
| react | >= 19 |

## License

MIT
