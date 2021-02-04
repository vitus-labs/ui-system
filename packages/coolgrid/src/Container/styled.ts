import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  normalizeUnit,
  extendedCss,
} from '@vitus-labs/unistyle'

const styles = ({ theme: t, css, rootSize }) => css`
  max-width: ${normalizeUnit({ param: t.width, rootSize })};
  ${extendedCss(t.extendCss)};
`

export default config.styled(config.component)`
  ${
    config.isWeb &&
    config.css`
      box-sizing: border-box;
    `
  };

  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: auto;
  margin-left: auto;
  /* overflow-x: hidden; */

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css: config.css,
    normalize: true,
  })};
`
