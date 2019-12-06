import config from '@vitus-labs/core'
import { alignContent, extendedCss, makeItResponsive } from '@vitus-labs/unistyle'

// ${config.isWeb &&
//     t.block &&
//     css`
//       width: 100%;
//     `}

const styles = ({ needsFix, css, theme: t }) => css`
  ${config.isWeb &&
    !needsFix &&
    css`
      display: flex;
    `};

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
    `};

  ${config.isNative &&
    config.css`
      display: flex;
    `};

  ${makeItResponsive({ key: 'element', styles, css: config.css })};
`
