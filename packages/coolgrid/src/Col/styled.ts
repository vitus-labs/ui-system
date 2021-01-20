import { config } from '@vitus-labs/core'
import { makeItResponsive, normalizeUnit } from '@vitus-labs/unistyle'
import { hasValue, isVisible } from '~/utils'

const hasWidth = (size, columns) => hasValue(size) && hasValue(columns)

const widthStyles = ({ size, columns, gap, RNparentWidth }, { rootSize }) => {
  if (!hasWidth(size, columns)) {
    return ''
  }

  // calculate % of width
  const width = __WEB__
    ? (size / columns) * 100
    : (RNparentWidth / columns) * size

  const hasGap = hasValue(gap)

  console.log('width', width)
  console.log('gap', gap)
  console.log('hasGap', hasGap)

  // eslint-disable-next-line no-nested-ternary
  const value = __WEB__
    ? hasGap
      ? `calc(${width}% - ${gap}px)`
      : `${width}%`
    : hasGap
    ? width - gap
    : width

  console.log('value', value)

  return config.css`
      flex-grow: 0;
      flex-shrink: 0;
      max-width: ${normalizeUnit({ param: value, rootSize })};
      flex-basis: ${normalizeUnit({ param: value, rootSize })};
    `
}

const gapStyles = (value, rootSize) => {
  if (!hasValue(value)) {
    return ''
  }

  return config.css`
    margin: ${normalizeUnit({ param: value / 2, rootSize })};
    `
}

const paddingStyles = (value, rootSize) => {
  if (!hasValue(value)) {
    return ''
  }

  return config.css`
    padding: ${normalizeUnit({ param: value, rootSize })};
    `
}

const styles = ({ theme, css, rootSize }) => {
  const { size, columns, gap, padding, extendCss, RNparentWidth } = theme
  const renderStyles = isVisible(size)

  return css`
    ${renderStyles
      ? css`
          left: initial;
          position: relative;
          ${widthStyles({ size, columns, gap, RNparentWidth }, { rootSize })}
          ${gapStyles(gap, rootSize)};
          ${paddingStyles(padding, rootSize)};
        `
      : css`
          left: -9999px;
          position: fixed;
        `};

    ${extendCss};
  `
}

export default config.styled(config.component)`
  ${
    __WEB__ &&
    config.css`
      box-sizing: border-box;
    `
  };

  position: relative;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  flex-direction: column;
  justify-content: stretch;

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css: config.css,
    normalize: true,
  })};
`
