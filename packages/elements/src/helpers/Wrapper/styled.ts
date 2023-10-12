import { config } from '@vitus-labs/core'
import { alignContent, extendCss, makeItResponsive } from '@vitus-labs/unistyle'
import type { ResponsiveStylesCallback } from '~/types'
import type { StyledProps, ThemeProps } from './types'

const { styled, css, component } = config

const childFixCSS = `
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`

const parentFixCSS = `
  flex-direction: column;
`

const parentFixBlockCSS = `
  width: 100%;
`

const fullHeightCSS = `
  height: 100%;
`

const blockCSS = `
  align-self: stretch;
`

const childFixPosition = (isBlock?: boolean) =>
  `display: ${isBlock ? 'flex' : 'inline-flex'};`

const styles: ResponsiveStylesCallback = ({
  theme: t,
  css,
}: {
  theme: ThemeProps
  css: typeof config.css
}) => css`
  ${__WEB__ && t.alignY === 'block' && fullHeightCSS};

  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.block && blockCSS};

  ${__WEB__ && !t.childFix && childFixPosition(t.block)};
  ${__WEB__ && t.parentFix && t.block && parentFixBlockCSS};
  ${__WEB__ && t.parentFix && parentFixCSS};

  ${t.extraStyles && extendCss(t.extraStyles)};
`

const platformCSS = __WEB__ ? `box-sizing: border-box;` : `display: flex;`

export default styled(component)<any>`
  position: relative;
  ${platformCSS};

  ${({ $childFix }: StyledProps) => $childFix && childFixCSS};

  ${makeItResponsive({
    key: '$element',
    styles,
    css,
    normalize: true,
  })};
`
