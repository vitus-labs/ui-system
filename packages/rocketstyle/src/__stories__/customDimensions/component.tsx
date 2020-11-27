import { Element } from '@vitus-labs/elements'
import rocketstyle from '../..'

const Example = () => <div></div>

export default rocketstyle({
  dimensions: {
    gaps: 'gap',
    paddings: 'padding',
    multiple: ['m', { multi: true }],
  },
  useBooleans: true,
})({ name: 'Button', component: Element })
  .config({
    component: Example,
  })
  .attrs({
    tag: 'button',
    label: 'This is a label',
    test: 'test',
    example: 'hello',
  })
  .attrs((a) => ({
    newProp: a.example ? 'a' : 'b',
    newExampleProp: a.test ? 'a' : 'b',
  }))
  .theme((t) => ({
    bgColor: '#007bff',
    color: '#fff',
  }))
  .theme({
    test: 'a',
  })
  .theme({
    bgColor: 'a',
  })
  .gaps({
    xxl: {
      padding: 10,
    },
    xl: {
      padding: 10,
    },
  })
  .styles(
    (css) => css`
      border: 1px solid transparent;
      ${'' /* padding: 0 0.75rem; */}

      height: 80px;
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
          background-color: #0069d9;
          border-color: #0062cc;
        }
      `};
    `
  )
  .paddings((t) => ({
    paddingxl: {
      paddingX: 50,
    },
  }))
  .gaps((t) => ({
    gapxl: {
      marginX: 50,
    },
    gapXxl: {
      marginX: 60,
    },
    gapXxxl: {
      marginX: 70,
    },
  }))
  .multiple({
    test: {
      fontSize: 20,
    },
    testB: {
      textAlign: 'right',
    },
  })
