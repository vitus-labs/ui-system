import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  normalizeUnit,
  extendedCss,
} from '@vitus-labs/unistyle'
import { isNumber } from '~/utils'

type ContentAlignValuesKeys = keyof typeof contentAlignValues
const contentAlignValues = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
  spaceAround: 'space-around',
  spaceBetween: 'space-between',
  spaceEvenly: 'space-evenly',
}

const spacingStyles = ({ gap, gutter }, { rootSize }) => {
  if (!isNumber(gap)) return ''

  const value = (param) => normalizeUnit({ param, rootSize })

  const spacingX = (gap / 2) * -1
  const spacingY = isNumber(gutter) ? gutter - gap / 2 : gap / 2

  return config.css`
    margin: ${value(spacingY)} ${value(spacingX)};
  `
}

const contentAlign = (align: ContentAlignValuesKeys) => {
  if (!align) return ''

  return config.css`
    justify-content: ${contentAlignValues[align]};
  `
}

const styles = ({ theme, css, rootSize }) => {
  const { gap, gutter, contentAlignX, extendCss } = theme

  return css`
    ${spacingStyles({ gap, gutter }, { rootSize })};
    ${contentAlign(contentAlignX)};
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

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css: config.css,
    normalize: true,
  })};
`
