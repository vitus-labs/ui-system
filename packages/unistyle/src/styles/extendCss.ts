import { config } from '@vitus-labs/core'

export type ExtendCss = (
  styles: string | ((css: typeof config.css) => typeof css) | null | undefined
) => string | typeof config.css

const extendCss: ExtendCss = (styles) => {
  if (!styles) return ''
  if (typeof styles === 'function') {
    return styles(config.css)
  }

  return styles
}

export default extendCss
