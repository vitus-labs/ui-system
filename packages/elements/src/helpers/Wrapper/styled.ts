import { config } from '@vitus-labs/core'
import { alignContent, extendCss, makeItResponsive } from '@vitus-labs/unistyle'

const styles = ({ theme: t, css }) =>
  css`
    ${__WEB__ &&
    css`
      display: ${({ $needsFix }) => {
        if ($needsFix) return ''
        return t.block ? 'flex' : 'inline-flex'
      }};
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

   ${({ $needsFix }) =>
     $needsFix &&
     config.css`
      display: flex;
      flex-direction: column;
    `};

  ${({ $isInner }) =>
    $isInner &&
    config.css`
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
