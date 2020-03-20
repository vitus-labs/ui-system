import theme from '../bootstrap-4/themeDecorator'
import Button from '../bootstrap-4/Button'
import RocketStyleDocs from '../../generateStories'

storiesOf('ROCKETSTYLE | Automatic', module)
  .addDecorator(theme)
  .add('Button - general', () => {
    return (
      <RocketStyleDocs
        component={Button}
        type="documentation"
        props={{
          onClick: () => {
            console.log('hello')
          },
          label: 'Arunoda Susiripala'
        }}
      />
    )
  })
  .add('Button - states', () => {
    const props = ({ state }) => ({
      onClick: () => {
        console.log('docs')
      },
      label: `${state} button`
    })
    return <RocketStyleDocs component={Button} type="states" props={props} />
  })
  .add('Button - sizes', () => {
    const props = ({ size }) => ({
      onClick: () => {},
      label: `${size} button`
    })
    return <RocketStyleDocs component={Button} type="sizes" props={props} />
  })
  .add('Hello', () => <Button multiple={['outline']}>Hello</Button>)
