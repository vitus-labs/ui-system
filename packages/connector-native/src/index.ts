// Side-effect import to make `@vitus-labs/core` visible for augmentation.
import type {} from '@vitus-labs/core'
import type { CSSResult } from '~/css'

// Tell @vitus-labs/core what shape `css(...)` returns when this connector is
// active. The native engine's CSSResult is a branded plain object with
// pre-parsed statics and a resolve(props) method.
declare module '@vitus-labs/core' {
  interface CSSEngineResult extends CSSResult {}
}

export { default as createMediaQueries } from '~/createMediaQueries'
export { css } from '~/css'
export { ThemeProvider as provider, ThemeProvider, useTheme } from '~/provider'
export { styled } from '~/styled'
