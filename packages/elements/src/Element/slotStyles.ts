/**
 * Slot styling logic extracted from Content/styled.ts for use with the
 * useCSS hook. Handles responsive flex alignment, gap spacing, equalCols,
 * and extendCss injection for before/content/after slots.
 */
import { config } from '@vitus-labs/core'
import {
  alignContent,
  extendCss,
  makeItResponsive,
  value,
} from '@vitus-labs/unistyle'
import type { ResponsiveStylesCallback } from '~/types'

// --------------------------------------------------------
// gap spacing between before / content / after
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
  value: v,
}: {
  direction: keyof typeof gapDimensions
  type: 'before' | 'content' | 'after'
  value: string | number | null | undefined
}) => {
  if (!direction || !type || type === 'content') return undefined
  return `${gapDimensions[direction][type]}: ${v};`
}

// --------------------------------------------------------
// responsive styles callback (used by makeItResponsive)
// --------------------------------------------------------
const slotStyles: ResponsiveStylesCallback = ({ css, theme: t, rootSize }) =>
  css`
  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.equalCols && 'flex: 1;'};

  ${
    t.gap &&
    t.contentType &&
    calculateGap({
      direction: t.parentDirection,
      type: t.contentType,
      value: value(t.gap, rootSize),
    })
  };

  ${t.extraStyles && extendCss(t.extraStyles as any)};
`

// --------------------------------------------------------
// lazy CSSResult template — created on first call (after init)
// --------------------------------------------------------
let _template: any = null

export const getSlotTemplate = () => {
  if (!_template) {
    const { css } = config
    _template = css`
      ${__WEB__ ? 'box-sizing: border-box;' : ''};
      display: flex;
      align-self: stretch;
      flex-wrap: wrap;
      ${({ $contentType }: any) => $contentType === 'content' && 'flex: 1;'};
      ${makeItResponsive({
        key: '$element',
        styles: slotStyles,
        css,
        normalize: true,
      })};
    `
  }
  return _template
}
