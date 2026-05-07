// Side-effect import to make `@vitus-labs/core` visible for augmentation.
import type {} from '@vitus-labs/core'
import styled, {
  createGlobalStyle,
  css,
  keyframes,
  ThemeProvider,
  useTheme,
} from 'styled-components'

// Derive the css return shape from styled-components' own typings rather
// than naming a type that may not exist across versions (FlattenSimpleInterpolation
// was removed in v6).
type StyledComponentsCssResult = ReturnType<typeof css>

// Tell @vitus-labs/core what shape `css(...)` returns when this connector is
// active. styled-components' `css` returns a RuleSet/array shape that flows
// cleanly into Css / ExtendCss types in elements/unistyle.
declare module '@vitus-labs/core' {
  interface CSSEngineResult
    extends Extract<StyledComponentsCssResult, object> {}
}

export { createGlobalStyle, css, keyframes, styled, useTheme }
export const provider = ThemeProvider
