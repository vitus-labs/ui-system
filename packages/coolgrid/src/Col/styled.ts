import { config } from '@vitus-labs/core'
import type { MakeItResponsiveStyles } from '@vitus-labs/unistyle'
import { extendCss, makeItResponsive, value } from '@vitus-labs/unistyle'
import type { CssOutput, StyledTypes } from '~/types'
import { hasValue, isNumber, isVisible } from '~/utils'

const { styled, css, component } = config

type HasWidth = (size?: number, columns?: number) => boolean

/** Returns true when both size and columns are valid, enabling explicit width calculation. */
const hasWidth: HasWidth = (size, columns) =>
  hasValue(size) && hasValue(columns)

type WidthStyles = (
  props: Pick<StyledTypes, 'size' | 'columns' | 'gap' | 'RNparentWidth'>,
  defaults: { rootSize?: number },
) => CssOutput

/**
 * Calculates column width as a percentage of total columns, subtracting
 * the gap when present. On web uses `calc(%)`, on native uses absolute pixels.
 */
const widthStyles: WidthStyles = (
  { size, columns, gap, RNparentWidth },
  { rootSize },
) => {
  if (!hasWidth(size, columns)) {
    return ''
  }

  const s = size as number
  const c = columns as number
  const g = gap as number

  // calculate % of width
  const width = __WEB__ ? (s / c) * 100 : (RNparentWidth / c) * s

  const hasGap = hasValue(gap)

  const val = __WEB__
    ? hasGap
      ? `calc(${width}% - ${g}px)`
      : `${width}%`
    : hasGap
      ? width - g
      : width

  return css`
    flex-grow: 0;
    flex-shrink: 0;
    max-width: ${value(val, rootSize)};
    flex-basis: ${value(val, rootSize)};
  `
}

type SpacingStyles = (
  type: 'margin' | 'padding',
  param?: number,
  rootSize?: number,
) => CssOutput
/** Applies half of the given value as either margin or padding (used for gap and padding distribution). */
const spacingStyles: SpacingStyles = (type, param, rootSize) => {
  if (!isNumber(param)) {
    return ''
  }

  const finalStyle = `${type}: ${value((param as number) / 2, rootSize)}`

  return css`
    ${finalStyle};
  `
}

/**
 * Main responsive style block for Col. When the column is visible, applies
 * width, padding, margin, and extra CSS. When hidden (size === 0), moves
 * the element off-screen with fixed positioning.
 */
const styles: MakeItResponsiveStyles<StyledTypes> = ({
  theme,
  css,
  rootSize,
}) => {
  const { size, columns, gap, padding, extraStyles, RNparentWidth } = theme
  const renderStyles = isVisible(size)

  if (renderStyles) {
    return css`
      left: initial;
      position: relative;
      ${widthStyles({ size, columns, gap, RNparentWidth }, { rootSize })};
      ${spacingStyles('padding', padding, rootSize)};
      ${spacingStyles('margin', gap, rootSize)};
      ${extendCss(extraStyles)};
    `
  }

  return css`
    left: -9999px;
    position: fixed;
    margin: 0;
    padding: 0;
  `
}

export default styled(component)<any>`
  ${
    __WEB__ &&
    css`
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
    css,
    normalize: true,
  })};
`
