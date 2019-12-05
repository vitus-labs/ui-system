import config from '@vitus-labs/core'

const extendedCss = styles => {
  if (!styles) return undefined
  if (typeof styles === 'function') {
    return styles(config.css)
  }

  return styles
}

export default extendedCss
