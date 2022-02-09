import { config } from '@vitus-labs/core'
import { alignContent, extendCss, makeItResponsive } from '@vitus-labs/unistyle'

const styles = ({ theme: t, css }) => css`
  ${__WEB__ &&
  css`
    ${({ $childFix }) =>
      !$childFix &&
      css`
        display: ${t.block ? 'flex' : 'inline-flex'};
      `};

    ${({ $parentFix }) =>
      $parentFix &&
      t.block &&
      css`
        flex-direction: column;
        width: 100%;
      `};
  `};

  ${__WEB__ &&
  t.alignY === 'block' &&
  css`
    height: 100%;
  `};

  ${alignContent({
    direction: t.direction,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.block &&
  css`
    align-self: stretch;
  `}

  ${t.extraStyles && extendCss(t.extraStyles)};
`

const platformStyles = __WEB__ ? 'box-sizing: border-box;' : 'display: flex;'

export default config.styled(config.component)`
  position: relative;
  ${platformStyles};

  ${({ $childFix }) =>
    $childFix &&
    config.css`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
  `};

  ${makeItResponsive({
    key: '$element',
    styles,
    css: config.css,
    normalize: true,
  })};
`
