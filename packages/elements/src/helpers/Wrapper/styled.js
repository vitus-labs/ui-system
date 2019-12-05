import config from '@vitus-labs/core'
import { alignContent, extendedCss, makeItResponsive } from '@vitus-labs/unistyle'

const styles = ({ needsFix, css, theme: t }) => css`
  ${config.isWeb &&
    !needsFix &&
    css`
      display: flex;
    `};

  ${config.isWeb &&
    t.block &&
    css`
      width: 100%;
    `}

  ${t.contentDirection &&
    alignContent({
      direction: t.contentDirection,
      alignX: t.alignX,
      alignY: t.alignY
    })};

  ${t.extendCss && extendedCss(t.extendCss)};
`

// TODO: display quick fix to be improved later
export default config.styled(config.component)`
  position: relative;

  ${!config.isNative &&
    config.css`
      box-sizing: border-box;
      display: flex;
    `};

  ${config.isNative &&
    config.css`
      display: flex;
    `};

  ${makeItResponsive({ key: 'element', styles, css: config.css })};
`
