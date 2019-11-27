import CONFIG from './config'

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

export const value = ({ param, rootSize = 16, outputUnit = CONFIG().isWeb ? 'rem' : 'px' }) => {
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

const getValue = (...values) =>
  values.find(value => typeof value !== 'undefined' && value !== null)

export default ({ theme: t, css, rootSize }) => css`

  ${t.hideEmpty && css`
    &:empty {
      display: none;
    }
  `};

  ${t.fullScreen
    && css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `};

  ${t.display && `display: ${t.display};`};
  ${t.position && `position: ${t.position};`};

  ${t.top && `top: ${t.top};`};
  ${t.bottom && `bottom: ${t.bottom};`};
  ${t.left && `left: ${t.left};`};
  ${t.top && `right: ${t.right};`};

  width: ${value({ param: getValue(t.width, t.size), rootSize })};
  min-width: ${value({ param: getValue(t.minWidth, t.minSize), rootSize })};
  max-width: ${value({ param: getValue(t.maxWidth, t.maxSize), rootSize })};

  height: ${value({ param: getValue(t.height, t.size), rootSize })};
  min-height: ${value({ param: getValue(t.minHeight, t.minSize), rootSize })};
  max-height: ${value({ param: getValue(t.maxHeight, t.maxSize), rootSize })};

  margin-top: ${value({ param: getValue(t.marginTop, t.marginY), rootSize })};
  margin-bottom: ${value({ param: getValue(t.marginBottom, t.marginY), rootSize })};
  margin-left: ${value({ param: getValue(t.marginLeft, t.marginX), rootSize })};
  margin-right: ${value({ param: getValue(t.marginRight, t.marginX), rootSize })};

  padding-top: ${value({ param: getValue(t.paddingTop, t.paddingY), rootSize })};
  padding-bottom: ${value({ param: getValue(t.paddingBottom, t.paddingY), rootSize })};
  padding-left: ${value({ param: getValue(t.paddingLeft, t.paddingX), rootSize })};
  padding-right: ${value({ param: getValue(t.paddingRight, t.paddingX), rootSize })};

  line-height: ${t.lineHeight};
  font-family: ${t.fontFamily};
  font-size: ${value({ param: t.fontSize, rootSize })};
  font-style: ${t.fontStyle};
  font-weight: ${t.fontWeight};
  text-align: ${t.textAlign};
  text-transform: ${t.textTransform};
  text-decoration: ${t.textDecoration};

  color: ${t.color};
  background-size: ${t.bgSize};
  background-color: ${t.bgColor};
  ${t.bgImg
    && css`
      background-image: url(${t.bgImg});
    `};

  border-radius: ${value({ param: t.borderRadius, rootSize })};

  ${() => {
    if (t.borderWidth && t.borderStyle && t.borderColor) {
      const params = `${value({ param: t.borderWidth, rootSize })} ${t.borderStyle} ${t.borderColor};`
      if (t.borderSide) return css`border-${t.borderSide}: ${params};`

      return css`border: ${params};`;
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
