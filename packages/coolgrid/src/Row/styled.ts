import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  normalizeUnit,
  extendedCss,
  alignContentAlignX,
  StylesCb,
} from '@vitus-labs/unistyle'
import { isNumber } from '~/utils'
import { CssOutput, StyledTypes } from '~/types'

type SpacingStyles = (
  props: Pick<StyledTypes, 'gap' | 'gutter'>,
  { rootSize }: { rootSize?: number }
) => CssOutput

const spacingStyles: SpacingStyles = ({ gap, gutter }, { rootSize }) => {
  if (!isNumber(gap)) return ''

  const value = (param) => normalizeUnit({ param, rootSize })

  const spacingX = (gap / 2) * -1
  const spacingY = isNumber(gutter) ? gutter - gap / 2 : gap / 2

  return config.css`
    margin: ${value(spacingY)} ${value(spacingX)};
  `
}

const contentAlign = (align?: StyledTypes['contentAlignX']) => {
  if (!align) return ''

  return config.css`
    justify-content: ${alignContentAlignX[align]};
  `
}

const styles: StylesCb<
  Pick<StyledTypes, 'gap' | 'gutter' | 'contentAlignX' | 'extendCss'>
> = ({ theme, css, rootSize }) => {
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
