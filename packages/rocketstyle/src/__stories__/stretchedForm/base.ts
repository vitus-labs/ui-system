/* eslint-disable no-underscore-dangle */
import { Element, List, Text } from '@vitus-labs/elements'
import { omit, pick } from '@vitus-labs/core'
import { makeItResponsive, styles } from '@vitus-labs/unistyle'
import rocketstyle from '../..'

export const element = rocketstyle()({
  name: 'Basic.Element',
  component: Element,
})
  .theme((t) => ({
    fontFamily: t.fontFamily.base,
    lineHeight: t.lineHeight.base,
    fontSize: t.fontSize.sm,
  }))
  .styles(
    (css) => css`
      box-sizing: border-box;
      text-decoration: none;
      ${({
        rocketstyle,
        rocketstate,
        outline,
        disabled,
        active,
        onClick,
        href,
        useDefaultFocus,
        useDefaultHover,
        useDefaultActive,
        useDefaultOutline,
      }) => {
        const isDynamic = onClick || href

        const baseTheme = {
          ...omit(rocketstyle, ['base', 'hover', 'focus', 'active']),
          ...pick(rocketstyle, ['base']).base,
        }

        const hoverTheme = pick(rocketstyle, ['hover'])
        const focusTheme = pick(rocketstyle, ['focus'])
        const activeTheme = pick(rocketstyle, ['active'])

        const _baseTheme = makeItResponsive({
          theme: baseTheme || {},
          styles,
          css,
        })

        const _hoverTheme = makeItResponsive({
          theme: hoverTheme.hover || {},
          styles,
          css,
        })

        const _focusTheme = makeItResponsive({
          theme: focusTheme.focus || {},
          styles,
          css,
        })

        const _activeTheme = makeItResponsive({
          theme: activeTheme.active || {},
          styles,
          css,
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
        `
      }};
    `
  )

export const list = element
  .config({
    name: 'Basic.List',
    component: List,
  })
  .styles(
    (css) => css`
      margin: 0;
      padding: 0;
    `
  )

export const text = element.config({
  name: 'Basic.Text',
  component: Text,
})

export const link = element.attrs(({ href }) => ({
  tag: href ? 'a' : 'button',
}))
