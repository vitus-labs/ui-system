import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  value,
  extendCss,
  MakeItResponsiveStyles,
} from '@vitus-labs/unistyle'
import { StyledTypes } from '~/types'

const { styled, css, component } = config

const styles: MakeItResponsiveStyles<
  Pick<StyledTypes, 'width' | 'extraStyles'>
> = ({ theme: t, css, rootSize }) => css`
  max-width: ${value(t.width, rootSize)};
  ${extendCss(t.extraStyles)};
`

export default styled(component)<any>`
  ${__WEB__ &&
  css`
    box-sizing: border-box;
  `};

  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: auto;
  margin-left: auto;

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css,
    normalize: true,
  })};
`
