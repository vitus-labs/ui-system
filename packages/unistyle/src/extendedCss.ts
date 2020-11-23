import { config } from '@vitus-labs/core'

type ExtendedCss = (
  styles: string | ((css: typeof config.css) => typeof css) | undefined | null
) => string | typeof config.css | undefined

const extendedCss: ExtendedCss = (styles) => {
  if (!styles) return undefined
  if (typeof styles === 'function') {
    return styles(config.css)
  }

  return styles
}

export default extendedCss
