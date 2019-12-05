import { CONFIG } from '@vitus-labs/core'
import { makeItResponsive, alignContent, extendedCss } from '@vitus-labs/unistyle'

const styles = ({ css, theme: t }) => css`
  ${t.contentDirection &&
    t.alignX &&
    t.alignY &&
    alignContent({
      direction: t.contentDirection,
      alignX: t.alignX,
      alignY: t.alignY
    })};

  ${t.equalCols &&
    css`
      flex: 1;
    `};

  ${t.extendCss && extendedCss(t.extendCss)};
`

export default CONFIG().styled(CONFIG().component)`
  ${CONFIG().isWeb &&
    CONFIG().css`
      box-sizing: border-box;
    `}
  display: flex;
  align-self: stretch;

  ${({ isContent }) =>
    isContent &&
    CONFIG().css`
    flex: 1;
  `};

  ${makeItResponsive({ key: 'element', styles, css: CONFIG().css })};
`
