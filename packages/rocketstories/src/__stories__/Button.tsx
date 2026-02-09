import { config } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import rocketstyle from '@vitus-labs/rocketstyle'

const { styled } = config

const LeftContent = styled.span`
  margin-right: 10px;
  padding: 5px;
  border-radius: 4px;
  background-color: black;
`

const RightContent = styled.span`
  margin-left: 10px;
  padding: 2px;
  border-radius: 4px;
  background-color: #0069d9;
  line-height: 1;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  ${({ hover }) =>
    hover &&
    config.css`
        &:hover {
          background-color: black;
        };
      `};
`

export const Button = rocketstyle()({ name: 'Button', component: Element })
  .attrs({
    tag: 'button',
    label: 'This is a label',
    beforeContent: () => <LeftContent>ico</LeftContent>,
    afterContent: () => <RightContent>✕</RightContent>,
  })
  .theme({
    bgColor: '#007bff',
    color: '#fff',
  })
  .states({
    primary: { bgColor: 'black' },
    secondary: { bgColor: 'blue' },
    tertiary: { bgColor: 'papayawhip' },
  })
  .sizes({
    small: {
      size: 12,
    },
    medium: { size: 14 },
    large: { size: 14 },
    xLarge: { size: 14 },
  })
  .multiple({
    example: true,
    centered: {},
    left: {},
    right: {},
  })
  .styles(
    (css) => css`
      border: 1px solid transparent;
      padding: 0 0.75rem;
      height: 80px;
      font-size: 1rem;
      border-radius: 0.25rem;
      transition:
        color 0.15s ease-in-out,
        background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
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
          background-color: #0069d9;
          border-color: #0062cc;
        }
      `};
    `,
  )

const ExtendedButtonA = (props) => <Button {...props} />

const ExampleComponent = (props) => <span {...props} />

export const ElementExample = rocketstyle()({
  name: 'Button',
  component: ExampleComponent,
})
  // .config({
  //   consumer: ctx => ({ pseudo }) => ({ state: pseudo.hover ? 'primary' : null }),
  // })
  .states({
    primary: { color: 'blue' },
    secondary: { color: 'green' },
    danger: { color: 'pink' },
  })
  .styles(
    (css) => css`
      ${({ $rocketstyle: t }) => css`
        color: ${t.color};
      `};
    `,
  )

export const HoistedButton = Button.config({
  component: ExtendedButtonA,
  provider: true,
}).theme({ bgColor: 'papayawhip' })

export default Button
