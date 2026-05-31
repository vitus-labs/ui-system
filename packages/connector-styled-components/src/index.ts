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

/**
 * Hook that mirrors `@vitus-labs/styler`'s `useCSS` surface so consumer
 * code can import `useCSS` from any connector without import errors.
 *
 * Honest limitation: styled-components v6 has no public API that turns a
 * `css\`…\`` RuleSet into a standalone class name without a styled
 * component wrapper. Calling this from a styled-components-backed app
 * throws a clear error pointing at the supported migration path; the
 * shim exists purely so cross-engine code compiles.
 */
export const useCSS = (..._args: unknown[]): string => {
  throw new Error(
    '[@vitus-labs/connector-styled-components] useCSS() is not supported on styled-components — wrap the styles in `styled.<tag>` (or migrate to `@vitus-labs/connector-styler`, which supports useCSS natively).',
  )
}

export { createGlobalStyle, css, keyframes, styled, useTheme }
export const provider = ThemeProvider
