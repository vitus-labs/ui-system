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

  // On native, skip width calculation until onLayout provides RNparentWidth
  if (!__WEB__ && !RNparentWidth) return ''

  // calculate % of width
  const width = __WEB__ ? (s / c) * 100 : (RNparentWidth / c) * s

  const hasGap = hasValue(gap)

  const val = __WEB__
    ? hasGap
      ? `calc(${width}% - ${g}px)`
      : `${width}%`
    : hasGap
      ? Math.max(0, width - g)
      : width

  const v = value(val, rootSize)

  return css`
    flex-grow: 0;
    flex-shrink: 0;
    ${
      __WEB__
        ? css`
      max-width: ${v};
      flex-basis: ${v};
    `
        : css`
      width: ${v};
      flex-basis: auto;
    `
    }
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
// `offset` is rendered as a percentage of `columns` (matching how Col
// computes its own width), so a Col with `columns=12 offset=3` gets
// `margin-left: 25%`. Negative offsets pull the column LEFT, which CSS
// already supports via negative margin.
const offsetStyles = (
  offset: number | undefined,
  columns: number | undefined,
): string => {
  if (!isNumber(offset) || offset === 0 || !isNumber(columns) || columns <= 0)
    return ''
  const pct = (offset / columns) * 100
  return `margin-left: ${pct}%;`
}

const orderStyles = (order: number | undefined): string =>
  isNumber(order) ? `order: ${order};` : ''

const styles: MakeItResponsiveStyles<StyledTypes> = ({
  theme,
  css,
  rootSize,
}) => {
  const { size, columns, gap, padding, offset, order, auto, extraStyles, RNparentWidth } =
    theme
  const renderStyles = isVisible(size) || auto === true

  if (renderStyles) {
    // `auto` overrides the explicit-width path with `flex: 1 1 0%` so the
    // col stretches to fill remaining row space — Bootstrap's `col-*-auto`
    // analogue. When `auto` is set, we skip the width calc but still apply
    // padding/margin so the row's gap rhythm stays intact.
    return css`
      ${__WEB__ ? 'left: initial;' : ''}
      position: relative;
      ${
        auto === true
          ? __WEB__
            ? css`
                flex: 1 1 0%;
                max-width: 100%;
              `
            : css`
                flex: 1 1 auto;
                flex-basis: auto;
              `
          : widthStyles({ size, columns, gap, RNparentWidth }, { rootSize })
      };
      ${offsetStyles(offset, columns)};
      ${orderStyles(order)};
      ${spacingStyles('padding', padding, rootSize)};
      ${spacingStyles('margin', gap, rootSize)};
      ${extendCss(extraStyles)};
    `
  }

  return css`
    left: -9999px;
    position: ${__WEB__ ? 'fixed' : 'absolute'};
    margin: 0;
    padding: 0;
  `
}

export default styled(component)`
  ${
    __WEB__ &&
    css`
    box-sizing: border-box;
    justify-content: stretch;
  `
  }

  position: relative;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  flex-direction: column;

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css,
    normalize: true,
  })};
`
