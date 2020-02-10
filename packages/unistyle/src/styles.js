import config from '@vitus-labs/core'

export const stripUnit = (value, unitReturn) => {
  const cssRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/
  if (typeof value !== 'string') return unitReturn ? [value, undefined] : value
  const matchedValue = value.match(cssRegex)

  if (unitReturn) {
    if (matchedValue) return [parseFloat(value), matchedValue[2]]
    return [value, undefined]
  }

  if (matchedValue) return parseFloat(value)
  return value
}

export const normalizeUnit = ({
  param,
  rootSize = 16,
  outputUnit = config.isWeb ? 'rem' : 'px'
}) => {
  if (!param && param !== 0) return null

  const [value, unit] = stripUnit(param, true)
  if (!value && value !== 0) return null
  if (value === 0 || typeof value === 'string') return param // zero should be unitless

  if (rootSize && !Number.isNaN(value)) {
    if (!unit && outputUnit === 'px') return `${value}${outputUnit}`
    if (!unit) return `${value / rootSize}rem`
    if (unit === 'px' && outputUnit === 'rem') return `${value / rootSize}rem`
  }

  if (unit) return param

  return `${value}${outputUnit}`
}

const getValueOf = (...values) =>
  values.find(value => typeof value !== 'undefined' && value !== null)

export const value = (rootSize, values) => {
  return normalizeUnit({
    param: getValueOf(...values),
    rootSize
  })
}

export default ({ theme: t, css, rootSize }) => css`
  ${config.isWeb &&
    t.hideEmpty &&
    css`
      &:empty {
        display: none;
      }
    `};

  ${t.fullScreen &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `};

  /* POSITION attributes */
  display: ${t.display};
  position: ${t.position};

  top: ${value(rootSize, [t.top, t.positionY])};
  bottom: ${value(rootSize, [t.bottom, t.positionY])};
  left: ${value(rootSize, [t.left, t.positionX])};
  right: ${value(rootSize, [t.right, t.positionX])};

  /* SIZE attributes */
  width: ${value(rootSize, [t.width, t.size])};
  min-width: ${value(rootSize, [t.minWidth, t.minSize])};
  max-width: ${value(rootSize, [t.maxWidth, t.maxSize])};

  height: ${value(rootSize, [t.height, t.size])};
  min-height: ${value(rootSize, [t.minHeight, t.minSize])};
  max-height: ${value(rootSize, [t.maxHeight, t.maxSize])};

  /* SPACING attributes */
  margin: ${value(rootSize, [t.margin])};
  margin-top: ${value(rootSize, [t.marginTop, t.marginY])};
  margin-bottom: ${value(rootSize, [t.marginBottom, t.marginY])};
  margin-left: ${value(rootSize, [t.marginLeft, t.marginX])};
  margin-right: ${value(rootSize, [t.marginRight, t.marginX])};

  padding: ${value(rootSize, [t.padding])};
  padding-top: ${value(rootSize, [t.paddingTop, t.paddingY])};
  padding-bottom: ${value(rootSize, [t.paddingBottom, t.paddingY])};
  padding-left: ${value(rootSize, [t.paddingLeft, t.paddingX])};
  padding-right: ${value(rootSize, [t.paddingRight, t.paddingX])};

  /* FONT attributes */
  line-height: ${t.lineHeight};
  font-family: ${t.fontFamily};
  font-size: ${value(rootSize, [t.fontSize])};
  font-style: ${t.fontStyle};
  font-weight: ${t.fontWeight};
  text-align: ${t.textAlign};
  text-transform: ${t.textTransform};
  text-decoration: ${t.textDecoration};

  /* COLORS attributes */
  color: ${t.color};
  background-size: ${t.bgSize};
  background-color: ${t.bgColor};
  ${t.bgImg &&
    css`
      background-image: url(${t.bgImg});
    `};

  /* BORDERS attributes */
  border-radius: ${value(rootSize, [t.borderRadius])};
  border-style: ${t.borderStyle};
  border-color: ${t.borderColor};
  border-width: ${t.borderColor};

  ${() => {
    if (t.borderWidth && t.borderStyle && t.borderColor) {
      const params = `${normalizeUnit({ param: t.borderWidth, rootSize })} ${
        t.borderStyle
      } ${t.borderColor};`
      if (t.borderSide) return css`border-${t.borderSide}: ${params};`

      return css`
        border: ${params};
      `
    }

    return null
  }};

  outline: ${t.outline};
  transition: ${t.transition};
  animation: ${t.keyframe} ${t.animation};
  z-index: ${t.zIndex};
  box-shadow: ${t.boxShadow};
  transform: ${t.transform};
  opacity: ${t.opacity};
  overflow: ${t.overflow};
  white-space: ${t.whiteSpace};

  ${t.extendCss};
`
