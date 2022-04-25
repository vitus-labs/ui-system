import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  alignContent,
  extendCss,
  value,
} from '@vitus-labs/unistyle'

const equalCols = config.css`
  flex: 1;
`

const typeContent = config.css`
  flex: 1;
`

// --------------------------------------------------------
// calculate spacing between before / content / after
// --------------------------------------------------------
const calculateGap = ({ direction, type, value, css }) => {
  if (!direction || !type) return undefined

  const data = {
    inline: {
      before: 'margin-right',
      after: 'margin-left',
    },
    rows: {
      before: 'margin-bottom',
      after: 'margin-top',
    },
  }

  const finalStyles = `${data[direction][type]}: ${value};`

  return css`
    ${finalStyles};
  `
}

// --------------------------------------------------------
// calculations of styles to be rendered
// --------------------------------------------------------
const styles = ({ css, theme: t, rootSize }) => css`
  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.equalCols && equalCols};

  ${t.gap &&
  css`
    ${({ $contentType }) =>
      calculateGap({
        direction: t.parentDirection,
        type: $contentType,
        value: value(t.gap, rootSize),
        css,
      })}
  `};

  ${t.extraStyles && extendCss(t.extraStyles)};
`

const platformStyles = __WEB__ ? config.css`box-sizing: border-box;` : ''

export default config.styled(config.component)`
  ${__WEB__ && platformStyles};

  display: flex;
  align-self: stretch;
  flex-wrap: wrap;

  ${({ $contentType }) => $contentType === 'content' && typeContent};

  ${makeItResponsive({
    key: '$element',
    styles,
    css: config.css,
    normalize: true,
  })};
`
