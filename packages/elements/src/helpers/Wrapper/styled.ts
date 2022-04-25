import { config } from '@vitus-labs/core'
import { alignContent, extendCss, makeItResponsive } from '@vitus-labs/unistyle'

const childFix = config.css`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`

const parentFix = config.css`
  flex-direction: column;
  width: 100%;
`

const fullHeight = config.css`
  height: 100%;
`

const block = config.css`
  align-self: stretch;
`

const styles = ({ theme: t, css }) => css`
  ${__WEB__ && t.alignY === 'block' && fullHeight};

  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.block && block};

  ${__WEB__ &&
  css`
    ${({ $childFix }) =>
      !$childFix &&
      css`
        display: ${t.block ? 'flex' : 'inline-flex'};
      `};

    ${({ $parentFix }) => $parentFix && t.block && parentFix};
  `};

  ${t.extraStyles && extendCss(t.extraStyles)};
`

const platformStyles = __WEB__
  ? config.css`box-sizing: border-box;`
  : config.css`display: flex;`

export default config.styled(config.component)`
  position: relative;
  ${platformStyles};

  ${({ $childFix }) => $childFix && childFix};

  ${makeItResponsive({
    key: '$element',
    styles,
    css: config.css,
    normalize: true,
  })};
`
