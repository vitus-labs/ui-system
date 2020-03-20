import { Element, List, Text, Overlay, Util } from '@vitus-labs/elements'
import { omit, pick } from '@vitus-labs/core'
import { makeItResponsive, styles } from '@vitus-labs/unistyle'
import rocketstyle from '../../index'

export const element = rocketstyle()({
  name: 'Bootstrap.Element',
  component: Element
})
  // .attrs(({ onClick, href, tag }) => ({
  //   tag: href ? 'a' : onClick ? 'button' : tag
  // }))
  .theme(t => ({
    boxSizing: 'border-box',
    fontFamily: t.fontFamily.base,
    lineHeight: t.lineHeight,
    color: t.color.gray900
  }))
  .styles(
    css => css`
      text-decoration: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      ${({
        useDefaultFocus,
        useDefaultHover,
        useDefaultActive,
        useDefaultOutline,
        rocketstyle,
        rocketstate,
        href,
        onClick,
        hover,
        active,
        focus
      }) => {
        const isDynamic = onClick || href

        const getBaseTheme = {
          ...omit(rocketstyle, ['base', 'hover', 'focus', 'active']),
          ...pick(rocketstyle, ['base']).base
        }

        const getHoverTheme = pick(rocketstyle, ['hover'])
        const getFocusTheme = pick(rocketstyle, ['focus'])
        const getActiveTheme = pick(rocketstyle, ['active'])

        const baseTheme = makeItResponsive({
          theme: getBaseTheme || {},
          styles,
          css
        })

        const hoverTheme = makeItResponsive({
          theme: getHoverTheme.hover || {},
          styles,
          css
        })

        const focusTheme = makeItResponsive({
          theme: getFocusTheme.focus || {},
          styles,
          css
        })

        const activeTheme = makeItResponsive({
          theme: getActiveTheme.active || {},
          styles,
          css
        })

        return css`
          ${baseTheme};

          ${!rocketstate.disabled &&
            isDynamic &&
            css`
              cursor: pointer;
            `}

          ${!rocketstate.disabled &&
            (isDynamic || useDefaultHover) &&
            !rocketstate.active &&
            css`
              &:hover {
                ${hoverTheme};
              }
            `};

          ${!rocketstate.disabled &&
            (isDynamic || useDefaultFocus) &&
            css`
              &:focus {
                ${focusTheme};
              }
            `};

          ${!rocketstate.disabled &&
            (isDynamic || useDefaultActive) &&
            css`
              &:active {
                ${activeTheme};
              }
            `};

          ${!rocketstate.disabled &&
            rocketstate.outline &&
            useDefaultOutline &&
            css`
              background-color: transparent;
              border-color: ${getBaseTheme.borderColor};
              color: ${getBaseTheme.bgColor || getBaseTheme.color};

              ${isDynamic &&
                css`
                  &:hover {
                    background-color: ${getBaseTheme.bgColor};
                    border-color: ${getBaseTheme.bgColor};
                    color: ${getBaseTheme.color};
                  }
                `};
            `}

          ${!rocketstate.disabled &&
            css`
              ${hover && hoverTheme};
              ${focus && focusTheme};
              ${active && activeTheme};
            `};

          ${rocketstate.disabled &&
            css`
              pointer-events: none;
              cursor: default;
            `}
        `
      }};
    `
  )

export const list = element
  .config({
    name: 'Bootstrap.List',
    component: List
  })
  .styles(
    css => css`
      ${({ vertical }) =>
        vertical &&
        css`
          & > & {
            width: 100%;
          }
        `};

      ${({ useExtendedStyles = true, vertical }) => {
        if (useExtendedStyles) {
          return !vertical
            ? css`
                & > *:not(:first-child) {
                  border-top-left-radius: 0 !important;
                  border-bottom-left-radius: 0 !important;
                }

                & > *:not(:last-child) {
                  border-top-right-radius: 0 !important;
                  border-bottom-right-radius: 0 !important;
                }
              `
            : css`
                & > *:not(:first-child) {
                  border-top-left-radius: 0 !important;
                  border-top-right-radius: 0 !important;
                }

                & > *:not(:last-child) {
                  border-bottom-right-radius: 0 !important;
                  border-bottom-left-radius: 0 !important;
                }
              `
        }
      }}
    `
  )

export const text = element.config({
  name: 'Bootstrap.Text',
  component: Text
})

export const utility = rocketstyle()({
  name: 'Bootstrap.Utility',
  component: Util
})

export { Overlay }
