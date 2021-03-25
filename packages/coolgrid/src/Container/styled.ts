import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  normalizeUnit,
  extendCss,
  MakeItResponsiveStyles,
} from '@vitus-labs/unistyle'
import { StyledTypes } from '~/types'

const styles: MakeItResponsiveStyles<
  Pick<StyledTypes, 'width' | 'extraStyles'>
> = ({ theme: t, css, rootSize }) => css`
  max-width: ${normalizeUnit({ param: t.width, rootSize })};
  ${extendCss(t.extraStyles)};
`

export default config.styled(config.component)`
  ${
    __WEB__ &&
    config.css`
      box-sizing: border-box;
    `
  };

  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: auto;
  margin-left: auto;

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css: config.css,
    normalize: true,
  })};
`
