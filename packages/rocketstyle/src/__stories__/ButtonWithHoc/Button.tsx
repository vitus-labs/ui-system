import React, { useRef } from 'react'
import { Element } from '@vitus-labs/elements'
import { makeItResponsive, styles } from '@vitus-labs/unistyle'
import rocketstyle from '~/index'

const hoc = (WrapperComponent) => {
  const Enhanced = (props) => {
    const a = useRef(null)

    return <WrapperComponent {...props} ref={a} />
  }

  return Enhanced
}

// --------------------------------------------------------
// basic Button compoenent
// --------------------------------------------------------
export default rocketstyle()()({ name: 'Button', component: Element })
  .compose({
    wrappedByHoc: hoc,
  })
  .attrs<{ href?: string }>({
    tag: 'button',
    label: 'something',
  })
  .attrs<{ something?: boolean }>(({ content }) => ({
    tag: 'button',
    // label: true,
    contentAlignX: 'block',
    content,
    contentDirection: 'inline',
  }))
  .attrs(({ content }) => ({
    tag: 'button',
    // label: true,
    contentAlignX: 'block',
    content,
  }))
  .attrs({
    tag: 'button',
    alignX: 'center',
    contentDirection: 'reverseInline',
    href: '',
  })
  .theme({
    height: 40,
    fontSize: 16,
    paddingX: 12,
    paddingY: 0,
    backgroundColor: '#0d6efd',
    color: '#fff',
    borderRadius: 4,
    border: '1px solid transparent',
    transition: 'all 0.15s ease-in-out',

    hover: {
      backgroundColor: '#0b5ed7',
    },
  })
  .states({
    primary: {
      backgroundColor: '#6c757d',

      hover: {
        backgroundColor: '#5c636a',
      },
    },
  })
  .styles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (css) => css<any>`
      ${({
        href,
        onClick,
        $rocketstyle,
        $rocketstate: { disabled, active, hover, focus, pressed },
      }) => {
        const isDynamic = onClick || href

        const {
          hover: hoverStyles = {},
          focus: focusStyles = {},
          active: activeStyles = {},
          ...restStyles
        } = $rocketstyle

        const baseTheme = makeItResponsive({
          theme:
            {
              ...restStyles,
            } || {},
          styles,
          css,
        })

        const hoverTheme = makeItResponsive({
          theme: hoverStyles,
          styles,
          css,
        })

        const focusTheme = makeItResponsive({
          theme: focusStyles,
          styles,
          css,
        })

        const activeTheme = makeItResponsive({
          theme: activeStyles,
          styles,
          css,
        })

        return css`
          /* -------------------------------------------------------- */
          /* BASE STATE */
          /* -------------------------------------------------------- */
          ${baseTheme};

          ${!disabled &&
          isDynamic &&
          css`
            cursor: pointer;
          `}

          /* -------------------------------------------------------- */
        /* HOVER STATE */
        /* -------------------------------------------------------- */
        ${!disabled &&
          !active &&
          isDynamic &&
          css`
            &:hover {
              ${hoverTheme};
            }
          `};

          ${hover &&
          css`
            ${hoverTheme};
          `};

          /* -------------------------------------------------------- */
          /* FOCUS STATE */
          /* -------------------------------------------------------- */
          ${!disabled &&
          css`
            &:focus {
              ${focusTheme};
            }
          `};

          ${focus &&
          css`
            ${focusTheme};
          `};

          /* -------------------------------------------------------- */
          /* ACTIVE / PRESSED STATE */
          /* -------------------------------------------------------- */
          ${!disabled &&
          isDynamic &&
          css`
            &:active {
              ${activeTheme};
            }
          `};

          ${!disabled &&
          (active || pressed) &&
          css`
            ${activeTheme};
          `};
        `
      }};
    `
  )

//   (css) => css<{ $rocketstyle: any }>`
//     border: 1px solid transparent;
//     padding: 0 0.75rem;
//     height: 40px;
//     font-size: 1rem;
//     border-radius: 0.25rem;
//     transition: all 0.15s ease-in-out;
//     cursor: pointer;

//     &::before,
//     &::after {
//       content: '';
//       flex: 1 0 auto;
//     }

//     ${({ $rocketstyle: t }) => css`
//       color: ${t.color};
//       background-color: ${t.bgColor};
//       border-color: ${t.bgColor};

//       &:hover {
//         color: ${t.color};
//         background-color: ${t.hover.bgColor};
//       }
//     `};
//   `
// )
