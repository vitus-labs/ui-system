import { boolean, text } from '@storybook/addon-knobs'
import theme from '../bootstrap-4/themeDecorator'
import Button from '../bootstrap-4/Button'
import RocketStyleRender from '../../generateStories'

storiesOf('ROCKETSTYLE | Automatic', module)
  .addDecorator(theme)
  .add('Button - general', () => {
    return (
      <RocketStyleRender
        component={Button}
        type="documentation"
        props={{
          onClick: () => {},
          label: text('Name', 'Arunoda Susiripala')
        }}
      />
    )
  })
  .add('Button - states', () => {
    const props = ({ state }) => ({
      onClick: () => {},
      label: `${state} button`
    })
    return <RocketStyleRender component={Button} type="states" props={props} />
  })
  .add('Button - sizes', () => {
    const props = ({ size }) => ({
      onClick: () => {},
      label: `${size} button`
    })
    return <RocketStyleRender component={Button} type="sizes" props={props} />
  })
  .add('Hello', () => <Button multiple={['outline']}>Hello</Button>)
