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

// NOTE: this connector does NOT export `useCSS`. styled-components v6
// has no public API that turns a `css\`…\`` RuleSet into a standalone
// class name without a styled-component wrapper, and a throwing shim
// just to advertise a contract is theatre. Consumers needing the
// useCSS hook shape must use `@vitus-labs/connector-styler`; everyone
// else uses `styled.<tag>\`…\`` here.

export { createGlobalStyle, css, keyframes, styled, useTheme }
export const provider = ThemeProvider
