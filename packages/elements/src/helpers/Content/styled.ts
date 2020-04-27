import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  alignContent,
  extendedCss,
  value,
} from '@vitus-labs/unistyle'

const calculateGap = ({ direction, type, value, css }) => {
  if (direction === 'inline') {
    if (type === 'before')
      return css`
        margin-right: ${value};
      `

    if (type === 'after')
      return css`
        margin-left: ${value};
      `
  }

  if (direction === 'rows') {
    if (type === 'before')
      return css`
        margin-bottom: ${value};
      `

    if (type === 'after')
      return css`
        margin-top: ${value};
      `
  }

  return ''
}

const styles = ({ css, theme: t, rootSize }) => css`
  ${t.contentDirection &&
  t.alignX &&
  t.alignY &&
  alignContent({
    direction: t.contentDirection,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.equalCols &&
  css`
    flex: 1;
  `};

  ${t.gap &&
  css`
    ${({ contentType }) =>
      calculateGap({
        direction: t.parentDirection,
        type: contentType,
        value: value(rootSize, [t.gap]),
        css,
      })}
  `}

  ${t.extendCss && extendedCss(t.extendCss)};
`

export default config.styled(config.component)`
  ${
    config.isWeb &&
    config.css`
      box-sizing: border-box;
    `
  }
  display: flex;
  align-self: stretch;

  ${({ isContent }) =>
    isContent &&
    config.css`
    flex: 1;
  `};

  ${makeItResponsive({ key: 'element', styles, css: config.css })};
`
