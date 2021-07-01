import { List as list } from '@vitus-labs/elements'
import rocketstyle from '~/index'

// --------------------------------------------------------
// basic Button compoenent
// --------------------------------------------------------
export default rocketstyle()({
  dimensions: {
    gaps: 'gap',
  } as const,
})({ name: 'List', component: list })
  .attrs({
    rootElement: true,
  })
  .theme({
    bgColor: '#0d6efd',
    color: '#fff',

    hover: {
      bgColor: '#0b5ed7',
    },
  })
  .gaps({
    primary: {
      bgColor: '#6c757d',

      hover: {
        bgColor: '#5c636a',
      },
    },
  })
  .styles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
