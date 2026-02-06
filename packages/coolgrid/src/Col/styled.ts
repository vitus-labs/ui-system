/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from '@vitus-labs/core'
import type { MakeItResponsiveStyles } from '@vitus-labs/unistyle'
import { extendCss, makeItResponsive, value } from '@vitus-labs/unistyle'
import type { CssOutput, StyledTypes } from '~/types'
import { hasValue, isNumber, isVisible } from '~/utils'

const { styled, css, component } = config

type HasWidth = (size?: number, columns?: number) => boolean

const hasWidth: HasWidth = (size, columns) =>
  hasValue(size) && hasValue(columns)

type WidthStyles = (
  props: Pick<StyledTypes, 'size' | 'columns' | 'gap' | 'RNparentWidth'>,
  defaults: { rootSize?: number },
) => CssOutput

const widthStyles: WidthStyles = (
  { size, columns, gap, RNparentWidth },
  { rootSize },
) => {
  if (!hasWidth(size, columns)) {
    return ''
  }

  // calculate % of width
  const width = __WEB__
    ? (size! / columns!) * 100
    : (RNparentWidth / columns!) * size!

  const hasGap = hasValue(gap)

  // eslint-disable-next-line no-nested-ternary
  const val = __WEB__
    ? hasGap
      ? `calc(${width}% - ${gap}px)`
      : `${width}%`
    : hasGap
      ? width - gap!
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
const spacingStyles: SpacingStyles = (type, param, rootSize) => {
  if (!isNumber(param)) {
    return ''
  }

  const finalStyle = `${type}: ${value(param! / 2, rootSize)}`

  return css`
    ${finalStyle};
  `
}

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
