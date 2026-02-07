import { Element } from '@vitus-labs/elements'
import { makeItResponsive, styles } from '@vitus-labs/unistyle'
import rocketstyle from '~/index'

// --------------------------------------------------------
// basic Button compoenent
// --------------------------------------------------------
const Button = rocketstyle()({ name: 'Button', component: Element })
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
        backgroundColor: 'black',
      },
    },
    ale: null,
  })
  .multiple({
    centered: {
      textAlign: 'center',

      hover: {
        textAlign: 'left',
      },
    },
    example: true,
  })
  .states({
    primary: {
      color: 'white',
    },
    secondary: {
      color: 'white',
    },
  })
  .states({
    secondary: null,
  })
  .states({
    tertiary: { hello: true },
  })
  .multiple({
    a: {
      textAlign: 'center',

      hover: {
        textAlign: 'left',
      },
    },
    xy: true,
  })
  // .styles(({ props, rocketTheme, rocketstate: { pseudo } }) => {
  //   const { hover, focus, active, ...restStyles } = rocketTheme
  //   const result = [] as any

  //   const baseTheme = makeItResponsive({
  //     theme: restStyles,
  //     styles,
  //     css,
  //   })

  //   const hoverTheme = makeItResponsive({
  //     theme: hoverStyles,
  //     styles,
  //     css,
  //   })

  //   const focusTheme = makeItResponsive({
  //     theme: focusStyles,
  //     styles,
  //     css,
  //   })

  //   const activeTheme = makeItResponsive({
  //     theme: activeStyles,
  //     styles,
  //     css,
  //   })

  //   result.push(baseTheme)

  //   if (!props.disabled) {
  //     if (!pseudo.active && props.isDynamic) {
  //       result.push(`&:hover {${hoverTheme};}`)
  //     }

  //     if (pseudo.hover) {
  //       result.push(hoverTheme)
  //     }
  //   }
  // })
  .styles(
    (css) => css<any>`
      ${({
        href,
        onClick,
        $rocketstyle,
        $rocketstate: {
          disabled,
          pseudo: { active, hover, focus, pressed },
        },
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

          ${
            !disabled &&
            isDynamic &&
            css`
            cursor: pointer;
          `
          }

          /* -------------------------------------------------------- */
        /* HOVER STATE */
        /* -------------------------------------------------------- */
        ${
          !disabled &&
          !active &&
          isDynamic &&
          css`
            &:hover {
              ${hoverTheme};
            }
          `
        };

          ${
            hover &&
            css`
            ${hoverTheme};
          `
          };

          /* -------------------------------------------------------- */
          /* FOCUS STATE */
          /* -------------------------------------------------------- */
          ${
            !disabled &&
            css`
            &:focus {
              ${focusTheme};
            }
          `
          };

          ${
            focus &&
            css`
            ${focusTheme};
          `
          };

          /* -------------------------------------------------------- */
          /* ACTIVE / PRESSED STATE */
          /* -------------------------------------------------------- */
          ${
            !disabled &&
            isDynamic &&
            css`
            &:active {
              ${activeTheme};
            }
          `
          };

          ${
            !disabled &&
            (active || pressed) &&
            css`
            ${activeTheme};
          `
          };
        `
      }};
    `,
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

// --------------------------------------------------------
// Button with provider enabled with consumer component
// --------------------------------------------------------
export const ProviderButton = Button.config({
  name: 'ButtonProvider',
  provider: true,
  component: Element,
})

export const ButtonConsumer = rocketstyle()({
  name: 'ButtonConsumer',
  component: Element,
})
  .states({
    primary: { color: '#0d6efd', bgColor: 'white' },
    secondary: { color: 'green' },
    danger: { color: 'pink' },
  })
  .config({
    consumer: (ctx) =>
      ctx<typeof ProviderButton>(({ pseudo }) => ({
        state: pseudo.hover ? 'primary' : undefined,
      })),
  })
  .styles(
    (css) => css`
      transition: all 0.15s ease-in-out;
      padding: 4px;
      border-radius: 0.25rem;

      ${({ $rocketstyle: t }: any) => css`
        color: ${t.color};
        background-color: ${t.bgColor};
      `}
    `,
  )

export const ButtonWithRocketstyle = Button.config({
  name: 'ButtonWithRocketstyle',
  provider: true,
})

export default Button
