import config from '@vitus-labs/core'
import { makeItResponsive, normalizeUnit } from '@vitus-labs/unistyle'

const isNumber = number => Number.isFinite(number)

const styles = ({ theme, css, rootSize }) => {
  const t = {}
  t.padding = theme.padding
  t.margin = theme.gap / 2

  if (config.isWeb) {
    const width = (theme.size / theme.columns) * 100

    if (isNumber(width)) {
      t.flex = 0
      t.width = theme.gap ? `calc(${width}% - ${theme.gap}px)` : `${width}%`
    }
  }

  if (config.isNative) {
    const width = (theme.RNparentWidth / theme.columns) * theme.size

    if (isNumber(width)) {
      t.flex = 0
      t.width = theme.gap ? width - theme.gap : width
    }
  }

  return css`
    ${t.width &&
      css`
        max-width: ${normalizeUnit({ param: t.width, rootSize })};
        flex-grow: ${t.flex};
        flex-shrink: ${t.flex};
        flex-basis: ${normalizeUnit({ param: t.width, rootSize })};
      `};

    ${isNumber(t.margin) &&
      css`
        margin: ${normalizeUnit({ param: t.margin, rootSize })};
      `};

    ${isNumber(t.padding) &&
      css`
        padding: ${normalizeUnit({ param: t.padding, rootSize })};
      `};

    ${theme.extendCss};
  `
}

export default config.styled(config.component)`
  ${config.isWeb &&
    config.css`
      box-sizing: border-box;
    `};

  position: relative;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;

  ${({ coolgrid: { breakpoints, rootSize, ...rest } }) =>
    makeItResponsive({ theme: rest, styles, css: config.css })({
      theme: { breakpoints, rootSize }
    })};
`
