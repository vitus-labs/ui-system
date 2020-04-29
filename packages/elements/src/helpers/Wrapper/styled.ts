// @ts-nocheck
import { config } from '@vitus-labs/core'
import {
  alignContent,
  extendedCss,
  makeItResponsive,
} from '@vitus-labs/unistyle'

const isValue = (val) => val !== null && val !== undefined

const styles = ({ css, theme: t }) => css`
  ${config.isWeb &&
  css`
    display: ${({ needsFix }) => {
      if (needsFix) return ''
      return t.block ? 'flex' : 'inline-flex'
    }};
  `};

  ${config.isWeb &&
  isValue(t.block) &&
  css`
    ${({ needsFix }) =>
      needsFix &&
      css`
        width: ${t.block ? '100%' : 'initial'};
      `}
  `}

  ${config.isNative &&
  t.block &&
  css`
    align-self: stretch;
  `};

  ${t.contentDirection &&
  t.alignX &&
  t.alignY &&
  alignContent({
    direction: t.contentDirection,
    alignX: t.alignX,
    alignY: t.alignY,
  })};

  ${t.extendCss && extendedCss(t.extendCss)};
`

export default config.styled(config.component)`
  position: relative;

  ${
    !config.isNative &&
    config.css`
      box-sizing: border-box;
    `
  };

  ${
    config.isNative &&
    config.css`
      display: flex;
    `
  };

  ${({ isInner }) =>
    isInner &&
    config.css`
    width: 100%;
    height: 100%;
  `}

  ${makeItResponsive({ key: 'element', styles, css: config.css })};
`
