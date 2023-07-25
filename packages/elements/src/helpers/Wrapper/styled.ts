import { config } from '@vitus-labs/core'
import { alignContent, extendCss, makeItResponsive } from '@vitus-labs/unistyle'
import type { ResponsiveStylesCallback } from '~/types'

const { styled, css, component } = config

const childFix = `
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`

const parentFix = `
  flex-direction: column;
`

const parentFixBlock = `
  width: 100%;
`

const fullHeight = `
  height: 100%;
`

const block = `
  align-self: stretch;
`

const childFixPosition = (isBlock?: boolean) =>
  `display: ${isBlock ? 'flex' : 'inline-flex'};`

const styles: ResponsiveStylesCallback = ({ theme: t, css }) => css`
  ${__WEB__ && t.alignY === 'block' && fullHeight};

  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.block && block};

  ${__WEB__ && !t.childFix && childFixPosition(t.block)};
  ${__WEB__ && t.parentFix && t.block && parentFixBlock};
  ${__WEB__ && t.parentFix && parentFix};

  ${t.extraStyles && extendCss(t.extraStyles)};
`

const platformStyles = __WEB__ ? `box-sizing: border-box;` : `display: flex;`

export default styled(component)<any>`
  position: relative;
  ${platformStyles};

  ${({ $childFix }) => $childFix && childFix};

  ${makeItResponsive({
    key: '$element',
    styles,
    css,
    normalize: true,
  })};
`
