import { config } from '@vitus-labs/core'

export type ExtendCss = (
  styles:
    | ((css: typeof config.css) => ReturnType<typeof css>)
    | string
    | null
    | undefined,
) => string | ReturnType<typeof config.css>

/**
 * Evaluates an `extendCss` value — either a callback receiving `css`
 * or a raw CSS string. Returns empty string for null/undefined.
 */
const extendCss: ExtendCss = (styles) => {
  if (!styles) return ''
  if (typeof styles === 'function') {
    return styles(config.css)
  }

  return styles
}

export default extendCss
