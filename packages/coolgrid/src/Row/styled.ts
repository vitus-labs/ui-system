/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  value,
  extendCss,
  ALIGN_CONTENT_MAP_X,
  MakeItResponsiveStyles,
} from '@vitus-labs/unistyle'
import { isNumber } from '~/utils'
import { CssOutput, StyledTypes } from '~/types'

type SpacingStyles = (
  props: Pick<StyledTypes, 'gap' | 'gutter'>,
  { rootSize }: { rootSize?: number }
) => CssOutput

const spacingStyles: SpacingStyles = ({ gap, gutter }, { rootSize }) => {
  if (!isNumber(gap)) return ''

  const getValue = (param) => value(param, rootSize)

  const spacingX = (gap! / 2) * -1
  const spacingY = isNumber(gutter) ? gutter! - gap! / 2 : gap! / 2

  return config.css`
    margin: ${getValue(spacingY)} ${getValue(spacingX)};
  `
}

const contentAlign = (align?: StyledTypes['contentAlignX']) => {
  if (!align) return ''

  return config.css`
    justify-content: ${ALIGN_CONTENT_MAP_X[align]};
  `
}

const styles: MakeItResponsiveStyles<
  Pick<StyledTypes, 'gap' | 'gutter' | 'contentAlignX' | 'extraStyles'>
> = ({ theme, css, rootSize }) => {
  const { gap, gutter, contentAlignX, extraStyles } = theme

  return css`
    ${spacingStyles({ gap, gutter }, { rootSize })};
    ${contentAlign(contentAlignX)};
    ${extendCss(extraStyles)};
  `
}

export default config.styled<any>(config.component)`
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
