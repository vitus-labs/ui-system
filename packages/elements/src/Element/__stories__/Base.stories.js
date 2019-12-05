import config from '@vitus-labs/core'
import Element from '~/Element'

const extendCss = config.css`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 16px 32px;
  font-size: 16px;
  margin: 4px 2px;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`

const beforeContent = ({ hover, ...props }) => {
  return <span>{hover ? 'normal' : 'hover'}</span>
}

storiesOf('Element', module)
  .add('Basics', () => {
    return (
      <Element css={extendCss} beforeContent={beforeContent} afterContent="right">
        child
      </Element>
    )
  })
  .add('Empty element (e.g. input)', () => {
    return (
      <Element tag="input" css={extendCss}>
        child
      </Element>
    )
  })
