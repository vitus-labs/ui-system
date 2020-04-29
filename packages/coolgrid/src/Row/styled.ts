// @ts-nocheck
import { config } from '@vitus-labs/core'
import { makeItResponsive, normalizeUnit } from '@vitus-labs/unistyle'

const styles = ({ theme: t, css, rootSize }) => {
  let vertical = t.gap / 2
  const horizontal = -1 * vertical

  if (t.gutter === 0) vertical *= -1
  else if (t.gutter) vertical = t.gutter

  const value = (param) => normalizeUnit({ param, rootSize })

  return css`
    ${(vertical || horizontal) &&
    css`
      margin: ${value(vertical)} ${value(horizontal)};
    `};

    ${t.extendCss};
  `
}

export default config.styled(config.component)`
  ${
    config.isWeb &&
    config.css`
      box-sizing: border-box;
    `
  };

  display: flex;
  flex-wrap: wrap;
  align-self: stretch;
  flex-direction: row;

  ${({ coolgrid: { breakpoints, rootSize, ...rest } }) =>
    makeItResponsive({ theme: rest, styles, css: config.css })({
      theme: { breakpoints, rootSize },
    })};
`