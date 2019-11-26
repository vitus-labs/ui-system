import CONFIG from './config'

const extendedCss = styles => {
  if (!styles) return undefined
  if (typeof styles === 'function') {
    return styles(CONFIG().css)
  }

  return styles
}

export default extendedCss
