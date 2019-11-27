import { CONFIG, makeItResponsive, value } from '@vitus-labs/core'

const styles = ({ theme: t, css, rootSize }) => css`
  max-width: ${value({ param: t.width, rootSize })};
  ${t.extendCss};
`

export default CONFIG().styled(CONFIG().component)`
  ${CONFIG().isWeb &&
    CONFIG().css`
      box-sizing: border-box;
    `};

  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: auto;
  margin-left: auto;

  ${({ coolgrid: { breakpoints, rootSize, ...rest } }) =>
    makeItResponsive({ theme: rest, styles, css: CONFIG().css })({
      theme: { breakpoints, rootSize }
    })};
`
