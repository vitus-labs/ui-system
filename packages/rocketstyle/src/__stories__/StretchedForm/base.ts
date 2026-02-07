import { Element, List, Text } from '@vitus-labs/elements'
import { makeItResponsive, styles } from '@vitus-labs/unistyle'
import rocketstyle from '~/init'
import type theme from './theme'

type _TTheme = typeof theme
type TStyles = Parameters<typeof styles>[0]['theme']

type ResponsiveStyles<T extends Record<string, unknown>> = Record<
  keyof T,
  T[keyof T] | Record<string, T[keyof T]> | T[keyof T][]
>

type FinalStyles = ResponsiveStyles<TStyles>

type Theme = Partial<
  FinalStyles & { hover: FinalStyles; active: FinalStyles; focus: FinalStyles }
>

type CssProps = Partial<{
  $rocketstyle: Theme
  outline: boolean
  disabled: boolean
  active: boolean
  onClick: MouseEvent
  href: string
  useDefaultFocus: boolean
  useDefaultHover: boolean
  useDefaultActive: boolean
  useDefaultOutline: boolean
}>

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
    (css) => css<CssProps>`
      box-sizing: border-box;
      text-decoration: none;

      ${({
        $rocketstyle = {},
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

        const { hover: h, active: a, focus: f, ...b } = $rocketstyle

        const baseTheme = makeItResponsive({
          theme: b,
          styles,
          css,
        })

        const hoverTheme = makeItResponsive({
          theme: h,
          styles,
          css,
        })

        const focusTheme = makeItResponsive({
          theme: f,
          styles,
          css,
        })

        const activeTheme = makeItResponsive({
          theme: a,
          styles,
          css,
        })

        return css`
          /* ------------------------------------------------------ */
          /*  BASE state */
          /* ------------------------------------------------------ */
          ${baseTheme};

          ${
            !disabled &&
            isDynamic &&
            css`
            cursor: pointer;
          `
          }

          /* ------------------------------------------------------ */
          /*  HOVER state */
          /* ------------------------------------------------------ */
          ${
            !disabled &&
            (isDynamic || useDefaultHover) &&
            !active &&
            css`
            &:hover {
              ${hoverTheme};
            }
          `
          };

          /* ------------------------------------------------------ */
          /*  FOCUS state */
          /* ------------------------------------------------------ */
          ${
            !disabled &&
            (isDynamic || useDefaultFocus) &&
            css`
            &:focus {
              ${focusTheme};
            }
          `
          };

          /* ------------------------------------------------------ */
          /*  ACTIVE state */
          /* ------------------------------------------------------ */
          ${
            !disabled &&
            (isDynamic || useDefaultActive) &&
            css`
            &:active {
              ${activeTheme};
            }
          `
          };

          /* ------------------------------------------------------ */
          /*  OUTLINE revert colors */
          /* ------------------------------------------------------ */
          ${
            !disabled &&
            outline &&
            useDefaultOutline &&
            css`
            background-color: transparent;
            border-color: ${b.borderColor};
            color: ${b.bgColor || b.color};

            ${
              isDynamic &&
              css`
              &:hover {
                background-color: ${b.bgColor};
                border-color: ${b.bgColor};
                color: ${b.color};
              }
            `
            };
          `
          }
        `
      }};
    `,
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
    `,
  )

export const text = element.config({
  name: 'Basic.Text',
  component: Text,
})

export const link = element.attrs<{ href?: string }>(({ href }) => ({
  tag: href ? 'a' : 'button',
}))
