import { config } from '@vitus-labs/core'
import type { MakeItResponsiveStyles } from '@vitus-labs/unistyle'
import {
  ALIGN_CONTENT_MAP_X,
  extendCss,
  makeItResponsive,
  value,
} from '@vitus-labs/unistyle'
import type { CssOutput, StyledTypes } from '~/types'
import { isNumber } from '~/utils'

const { styled, css, component } = config

/**
 * Computes negative horizontal margins to compensate for column gap,
 * and vertical margins that account for gutter (inter-row spacing).
 * This creates the classic grid pattern where column gaps cancel out
 * at the row edges.
 */
type SpacingStyles = (
  props: Pick<StyledTypes, 'gap' | 'gutter'>,
  { rootSize }: { rootSize?: number },
) => CssOutput

const spacingStyles: SpacingStyles = ({ gap, gutter }, { rootSize }) => {
  if (!isNumber(gap)) return ''

  const g = gap as number
  const getValue = (param: any) => value(param, rootSize)

  const spacingX = (g / 2) * -1
  const spacingY = isNumber(gutter) ? (gutter as number) - g / 2 : g / 2

  return css`
    margin: ${getValue(spacingY)} ${getValue(spacingX)};
  `
}

/** Maps the contentAlignX prop to a CSS justify-content value. */
const contentAlign = (align?: StyledTypes['contentAlignX']) => {
  if (!align) return ''

  return css`
    justify-content: ${ALIGN_CONTENT_MAP_X[align]};
  `
}

/** Composes spacing, alignment, and extra CSS into a single responsive style block for the Row. */
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

export default styled(component)<any>`
  ${
    __WEB__ &&
    css`
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
    css,
    normalize: true,
  })};
`
