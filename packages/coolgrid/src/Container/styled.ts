import { config } from '@vitus-labs/core'
import type { MakeItResponsiveStyles } from '@vitus-labs/unistyle'
import { extendCss, makeItResponsive, value } from '@vitus-labs/unistyle'
import type { StyledTypes } from '~/types'

const { styled, css, component } = config

/** Responsive styles that apply the container's max-width and any extra CSS at each breakpoint. */
const styles: MakeItResponsiveStyles<
  Pick<StyledTypes, 'width' | 'extraStyles'>
> = ({ theme: t, css, rootSize }) => css`
  max-width: ${value(t.width, rootSize)};
  ${extendCss(t.extraStyles)};
`

/** Styled Container element. Centered via auto margins with responsive max-width. */
export default styled(component)<any>`
  ${
    __WEB__ &&
    css`
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
    css,
    normalize: true,
  })};
`
