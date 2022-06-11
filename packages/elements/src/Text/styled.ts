import { config } from '@vitus-labs/core'
import { makeItResponsive, extendCss } from '@vitus-labs/unistyle'
import type { ResponsiveStylesCallback } from '~/types'

const styles: ResponsiveStylesCallback = ({ css, theme: t }) => css`
  ${t.extraStyles && extendCss(t.extraStyles)};
`

export default config.styled(config.textComponent)`
  color: inherit;
  font-weight: normal;
  line-height: 1;

  ${makeItResponsive({
    key: '$text',
    styles,
    css: config.css,
    normalize: false,
  })};
`
