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
    fontFamily: t.fontFamily.base,
    lineHeight: t.lineHeight,
    color: t.color.gray900,
    borderStyle: 'solid'
  }))
  .styles(
    css => css`
      box-sizing: border-box;
      text-decoration: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      ${({
        useDefaultFocus,
        useDefaultHover,
        useDefaultActive,
        useDefaultOutline,
        href,
        onClick,
        disabled,
        hover,
        active,
        focus,
        outline,
        rocketstyle
      }) => {
        const isDynamic = onClick || href

        const baseTheme = {
          ...omit(rocketstyle, ['base', 'hover', 'focus', 'active']),
          ...pick(rocketstyle, ['base']).base
        }

        const hoverTheme = pick(rocketstyle, ['hover'])
        const focusTheme = pick(rocketstyle, ['focus'])
        const activeTheme = pick(rocketstyle, ['active'])

        const _baseTheme = makeItResponsive({
          theme: baseTheme || {},
          styles,
          css
        })

        const _hoverTheme = makeItResponsive({
          theme: hoverTheme.hover || {},
          styles,
          css
        })

        const _focusTheme = makeItResponsive({
          theme: focusTheme.focus || {},
          styles,
          css
        })

        const _activeTheme = makeItResponsive({
          theme: activeTheme.active || {},
          styles,
          css
        })

        return css`
          ${_baseTheme};

          ${!disabled &&
            isDynamic &&
            css`
              cursor: pointer;
            `}

          ${!disabled &&
            (isDynamic || useDefaultHover) &&
            !active &&
            css`
              &:hover {
                ${_hoverTheme};
              }
            `};

          ${!disabled &&
            (isDynamic || useDefaultFocus) &&
            css`
              &:focus {
                ${_focusTheme};
              }
            `};

          ${!disabled &&
            (isDynamic || useDefaultActive) &&
            css`
              &:active {
                ${_activeTheme};
              }
            `};

          ${!disabled &&
            outline &&
            useDefaultOutline &&
            css`
              background-color: transparent;
              border-color: ${baseTheme.borderColor};
              color: ${baseTheme.bgColor || baseTheme.color};

              ${isDynamic &&
                css`
                  &:hover {
                    background-color: ${baseTheme.bgColor};
                    border-color: ${baseTheme.bgColor};
                    color: ${baseTheme.color};
                  }
                `};
            `}

          ${!disabled &&
            css`
              ${hover && _hoverTheme};
              ${focus && _focusTheme};
              ${active && _activeTheme};
            `};

          ${disabled &&
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
