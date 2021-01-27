import { config } from '@vitus-labs/core'
import {
  alignContent,
  extendedCss,
  makeItResponsive,
} from '@vitus-labs/unistyle'

const isValue = (val) => val !== null && val !== undefined

const styles = ({ css, theme: t }) => {
  console.log('wrapper')
  console.log(t)
  return css`
    ${__WEB__ &&
    css`
      display: ${({ $needsFix }) => {
        if ($needsFix) return ''
        return t.block ? 'flex' : 'inline-flex'
      }};
    `};

    ${__WEB__ &&
    isValue(t.block) &&
    css`
      ${({ $needsFix }) =>
        $needsFix &&
        css`
          width: ${t.block ? '100%' : 'initial'};
        `}
    `};

    ${__NATIVE__ &&
    t.block &&
    css`
      align-self: stretch;
    `};

    ${alignContent({
      direction: t.direction,
      alignX: t.alignX,
      alignY: t.alignY,
    })};

    ${t.extendCss && extendedCss(t.extendCss)};
  `
}

export default config.styled(config.component)`
  position: relative;

  ${
    __WEB__ &&
    config.css`
      box-sizing: border-box;
    `
  };

  ${
    __NATIVE__ &&
    config.css`
      display: flex;
    `
  };

   ${({ $needsFix }) =>
     $needsFix &&
     config.css`
    display: flex;
    flex-direction: column;
  `};

  ${({ $isInner }) =>
    $isInner &&
    config.css`
    flex: 1;
    width: 100%;
    height: 100%;
  `};

  ${makeItResponsive({
    key: '$element',
    styles,
    css: config.css,
    normalize: true,
  })};
`
