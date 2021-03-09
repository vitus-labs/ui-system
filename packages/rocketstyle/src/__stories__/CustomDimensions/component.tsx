import { Element, Text } from '@vitus-labs/elements'
import rocketstyle from '~/init'

export default rocketstyle()({
  dimensions: {
    colors: 'color',
  } as const,
  useBooleans: true,
})({ name: 'Button', component: Text })
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
  .colors({
    primary: {
      bgColor: '#0d6efd',

      hover: {
        bgColor: '#0b5ed7',
      },
    },
    secondary: {
      bgColor: '#6c757d',

      hover: {
        bgColor: '#5c636a',
      },
    },
    paragraph: {
      bgColor: 'a',
    },
  })
  .styles(
    (css) => css<{ $rocketstyle: any }>`
      border: 1px solid transparent;
      height: 40px;
      font-size: 1rem;
      border-radius: 0.25rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        flex: 1 0 auto;
      }

      ${({ $rocketstyle: t }) => css`
        padding-left: ${t.paddingX}px;
        margin-left: ${t.marginX}px;
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
