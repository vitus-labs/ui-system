import { config } from '@vitus-labs/core'
import { alignContent, extendCss, makeItResponsive } from '@vitus-labs/unistyle'

const styles = ({ theme: t, css }) =>
  css`
    ${__WEB__ &&
    t.contentAlignY === 'block' &&
    css`
      height: 100%;
    `};

    ${__WEB__ &&
    css`
      ${({ $isInner }) =>
        !$isInner &&
        css`
          display: ${t.block ? 'flex' : 'inline-flex'};
        `};

      ${({ $needsFix }) =>
        $needsFix &&
        t.block &&
        css`
          flex-direction: column;
          width: 100%;
        `};
    `};

    ${__WEB__ &&
    t.contentAlignY === 'block' &&
    css`
      height: 100%;
    `};

    ${alignContent({
      direction: t.direction,
      alignX: t.alignX,
      alignY: t.alignY,
    })};

    ${t.extraStyles && extendCss(t.extraStyles)};
  `

const platformStyles = __WEB__
  ? config.css`
    box-sizing: border-box;
  `
  : config.css`
    display: flex;
  `

export default config.styled(config.component)`
  position: relative;
  ${platformStyles};

  ${({ $isInner }) =>
    $isInner &&
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
