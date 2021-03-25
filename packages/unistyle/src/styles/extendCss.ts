import { config } from '@vitus-labs/core'

export type ExtendCss = (
  styles:
    | string
    | ((css: typeof config.css) => ReturnType<typeof css>)
    | null
    | undefined
) => string | ReturnType<typeof config.css>

const extendCss: ExtendCss = (styles) => {
  if (!styles) return ''
  if (typeof styles === 'function') {
    return styles(config.css)
  }

  return styles
}

export default extendCss
