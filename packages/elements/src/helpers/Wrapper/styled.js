import {
  CONFIG,
  alignContent,
  extendedCss,
  makeItResponsive
} from "@vitus-labs/core";

const styles = ({ needsFix, css, theme: t }) => css`
  ${CONFIG().isWeb &&
    !needsFix &&
    css`
      display: flex;
    `};

  ${CONFIG().isWeb &&
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
`;

// TODO: display quick fix to be improved later
export default CONFIG().styled(CONFIG().component)`
  position: relative;

  ${!CONFIG().isNative &&
    CONFIG().css`
      box-sizing: border-box;
      display: flex;
    `};

  ${CONFIG().isNative &&
    CONFIG().css`
      display: flex;
    `};

  ${makeItResponsive({ key: "element", styles, css: CONFIG().css })};
`;
