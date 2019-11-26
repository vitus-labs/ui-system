import { CONFIG, makeItResponsive, value } from '@vitus-labs/core'

const styles = ({ theme: t, css, rootSize }) => {
  let vertical = t.gap / 2
  const horizontal = -1 * vertical

  if (t.gutter === 0) vertical *= -1
  else if (t.gutter) vertical = t.gutter

  return css`
    ${(vertical || horizontal) &&
      `margin: ${value({ param: vertical, rootSize })} ${value({ param: horizontal, rootSize })};`};
    ${t.extendCss};
  `
}

export default CONFIG().styled(CONFIG().component)`
  ${CONFIG().isWeb &&
    CONFIG().css`
      box-sizing: border-box;
    `};
    
  display: flex;
  flex-wrap: wrap;
  align-self: stretch;
  flex-direction: row;

  ${({ coolgrid: { breakpoints, rootSize, ...rest } }) =>
    makeItResponsive({ theme: rest, styles, css: CONFIG().css })({
      theme: { breakpoints, rootSize }
    })};
`
