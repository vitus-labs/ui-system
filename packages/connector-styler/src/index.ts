// Side-effect import to make `@vitus-labs/core` visible for augmentation.
import type {} from '@vitus-labs/core'
import type { CSSResult } from '@vitus-labs/styler'
import {
  createGlobalStyle,
  css,
  keyframes,
  styled,
  ThemeProvider,
  useCSS,
  useTheme,
} from '@vitus-labs/styler'

// Tell @vitus-labs/core what shape `css(...)` returns when this connector is
// active. After init({ ...connectorStyler }), every consumer of `config.css`
// gets styler's CSSResult type instead of an unaugmented `{}`.
declare module '@vitus-labs/core' {
  interface CSSEngineResult extends CSSResult {}
}

export { createGlobalStyle, css, keyframes, styled, useCSS, useTheme }
export const provider = ThemeProvider
