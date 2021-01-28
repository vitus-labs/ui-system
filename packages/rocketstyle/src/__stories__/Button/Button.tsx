import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/index'

// --------------------------------------------------------
// basic Button compoenent
// --------------------------------------------------------
const Button = rocketstyle()()({ name: 'Button', component: Element })
  .attrs({
    tag: 'button',
    label: 'This is a label',
  })
  .theme({
    bgColor: '#0d6efd',
    color: '#fff',

    hover: {
      bgColor: '#0b5ed7',
    },
  })
  .states({
    primary: {
      bgColor: '#6c757d',

      hover: {
        bgColor: '#5c636a',
      },
    },
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
  })
  .styles(
    (css) => css<{ $rocketstyle: any }>`
      border: 1px solid transparent;
      padding: 0 0.75rem;
      height: 40px;
      font-size: 1rem;
      border-radius: 0.25rem;
      transition: all 0.15s ease-in-out;
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        flex: 1 0 auto;
      }

      ${({ $rocketstyle: t }) => css`
        color: ${t.color};
        background-color: ${t.bgColor};
        border-color: ${t.bgColor};

        &:hover {
          color: ${t.color};
          background-color: ${t.hover.bgColor};
        }
      `};
    `
  )

// --------------------------------------------------------
// Button with provider enabled with consumer component
// --------------------------------------------------------
export const ProviderButton = Button.config({
  name: 'ButtonProvider',
  provider: true,
})

export const ButtonConsumer = rocketstyle()()({
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
        state: pseudo.hover ? 'primary' : null,
      })),
  })
  .styles(
    (css) => css<{ $rocketstyle: any }>`
      transition: all 0.15s ease-in-out;
      padding: 4px;
      border-radius: 0.25rem;

      ${({ $rocketstyle: t }) => css`
        color: ${t.color};
        background-color: ${t.bgColor};
      `}
    `
  )

export default Button
