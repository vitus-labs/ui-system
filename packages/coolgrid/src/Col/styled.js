import { CONFIG, makeItResponsive, value } from '@vitus-labs/core'

const isNumber = number => Number.isFinite(number)

const styles = ({ theme, css, rootSize }) => {
  const t = {}
  t.padding = theme.padding
  t.gap = theme.gap / 2

  if (CONFIG().isWeb) {
    const width = (theme.size / theme.columns) * 100

    if (width) {
      t.width = theme.gap ? `calc(${width}% - ${theme.gap}px)` : `${theme.width}%`
    }

    if (isNumber(width)) {
      t.flex = 0
      t.width = theme.gap ? `calc(${width}% - ${theme.gap}px)` : `${width}%`
    }
  }

  if (CONFIG().isNative) {
    const width = (theme.RNparentWidth / theme.columns) * theme.size

    if (isNumber(width)) {
      t.flex = 0
      t.width = theme.gap ? width - theme.gap : width
    }
  }

  return css`
    ${theme.size === 0
      ? css`
          display: none;
        `
      : css`
          display: flex;
        `};

    ${t.width &&
      css`
        max-width: ${value({ param: t.width, rootSize })};
        flex-grow: ${t.flex};
        flex-shrink: ${t.flex};
        flex-basis: ${value({ param: t.width, rootSize })};
      `};

    ${isNumber(t.gap) &&
      css`
        margin: ${value({ param: t.gap, rootSize })};
      `};

    ${isNumber(t.padding) &&
      css`
        padding: ${value({ param: t.padding, rootSize })};
      `};

    ${theme.extendCss};
  `
}

export default CONFIG().styled(CONFIG().component)`
  ${CONFIG().isWeb &&
    CONFIG().css`
      box-sizing: border-box;
    `};

  position: relative;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;

  ${({ coolgrid: { breakpoints, rootSize, ...rest } }) =>
    makeItResponsive({ theme: rest, styles, css: CONFIG().css })({
      theme: { breakpoints, rootSize }
    })};
`
