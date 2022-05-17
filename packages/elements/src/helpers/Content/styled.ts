import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  alignContent,
  extendCss,
  value,
} from '@vitus-labs/unistyle'
import type { ResponsiveStylesCallback } from '~/types'

const equalCols = `
  flex: 1;
`

const typeContent = `
  flex: 1;
`

// --------------------------------------------------------
// calculate spacing between before / content / after
// --------------------------------------------------------
const gapDimensions = {
  inline: {
    before: 'margin-right',
    after: 'margin-left',
  },
  rows: {
    before: 'margin-bottom',
    after: 'margin-top',
  },
} as const

const calculateGap = ({
  direction,
  type,
  value,
}: {
  direction: 'rows' | 'inline'
  type: 'before' | 'after'
  value: any
}) => {
  if (!direction || !type) return undefined

  const finalStyles = `${gapDimensions[direction][type]}: ${value};`

  return finalStyles
}

// --------------------------------------------------------
// calculations of styles to be rendered
// --------------------------------------------------------
const styles: ResponsiveStylesCallback = ({ css, theme: t, rootSize }) => css`
  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.equalCols && equalCols};

  ${t.gap &&
  t.contentType &&
  calculateGap({
    direction: t.parentDirection,
    type: t.contentType,
    value: value(t.gap, rootSize),
  })};

  ${t.extraStyles && extendCss(t.extraStyles)};
`

const platformStyles = __WEB__ ? `box-sizing: border-box;` : ''

export default config.styled<any>(config.component)`
  ${platformStyles};

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
