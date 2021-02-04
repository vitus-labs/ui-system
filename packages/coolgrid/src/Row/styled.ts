import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  normalizeUnit,
  extendedCss,
} from '@vitus-labs/unistyle'
import { hasValue, isNumber } from '~/utils'

const spacingStyles = ({ gap, gutter }, { rootSize }) => {
  if (!hasValue(gap)) return ''

  const value = (param) => normalizeUnit({ param, rootSize })

  const spacingX = (gap / 2) * -1
  const spacingY = isNumber(gutter) ? gutter - gap / 2 : gap / 2

  return config.css`
    margin: ${value(spacingY)} ${value(spacingX)};
  `
}

const styles = ({ theme, css, rootSize }) => {
  const { gap, gutter, extendCss } = theme

  return css`
    ${spacingStyles({ gap, gutter }, { rootSize })};
    ${extendedCss(extendCss)};
  `
}

export default config.styled(config.component)`
  ${
    __WEB__ &&
    config.css`
      box-sizing: border-box;
    `
  };

  display: flex;
  flex-wrap: wrap;
  align-self: stretch;
  flex-direction: row;
  /* overflow-x: hidden; */

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css: config.css,
    normalize: true,
  })};
`
