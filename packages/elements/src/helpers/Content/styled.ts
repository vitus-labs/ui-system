import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  alignContent,
  extendCss,
  value,
} from '@vitus-labs/unistyle'
import type { ResponsiveStylesCallback } from '~/types'
import type { StyledProps, ThemeProps } from './types'

const { styled, css, component } = config

const equalColsCSS = `
  flex: 1;
`

const typeContentCSS = `
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
  reverseInline: {
    before: 'margin-right',
    after: 'margin-left',
  },
  rows: {
    before: 'margin-bottom',
    after: 'margin-top',
  },
  reverseRows: {
    before: 'margin-bottom',
    after: 'margin-top',
  },
} as const

const calculateGap = ({
  direction,
  type,
  value,
}: {
  direction: keyof typeof gapDimensions
  type: ThemeProps['contentType']
  value: any
}) => {
  if (!direction || !type) return undefined

  const finalStyles = `${gapDimensions[direction][type]}: ${value};`

  return finalStyles
}

// --------------------------------------------------------
// calculations of styles to be rendered
// --------------------------------------------------------
const styles: ResponsiveStylesCallback = ({
  css,
  theme: t,
  rootSize,
}: {
  css: typeof config.css
  theme: ThemeProps
  rootSize: number
}) => css`
  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.equalCols && equalColsCSS};

  ${t.gap &&
  t.contentType &&
  calculateGap({
    direction: t.parentDirection,
    type: t.contentType,
    value: value(t.gap, rootSize),
  })};

  ${t.extraStyles && extendCss(t.extraStyles)};
`

const platformCSS = __WEB__ ? `box-sizing: border-box;` : ''

const StyledComponent = styled(component)<any>`
  ${platformCSS};

  display: flex;
  align-self: stretch;
  flex-wrap: wrap;

  ${({ $contentType }: StyledProps) =>
    $contentType === 'content' && typeContentCSS};

  ${makeItResponsive({
    key: '$element',
    styles,
    css,
    normalize: true,
  })};
`

export default StyledComponent
