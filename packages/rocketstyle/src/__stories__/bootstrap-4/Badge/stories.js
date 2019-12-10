import theme from '../themeDecorator'
import Badge from '.'
import Button from '../Button'
import Heading from '../Heading'

const renderExamples = props =>
  [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ].map(value => <Badge label={value} {...{ [value]: true }} {...props} />)

storiesOf(Badge.displayName, module)
  .addDecorator(theme)
  .add('Examples', () => (
    <Fragment>
      {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(value => (
        <Heading {...{ [value]: true }}>
          Example heading <Badge secondary label="New" />
        </Heading>
      ))}

      <Button primary>
        Primary&nbsp;
        <Badge light label="4" />
      </Button>
    </Fragment>
  ))
  .add('Contextual variations', () => <Fragment>{renderExamples()}</Fragment>)
  .add('Pill badges', () => <Fragment>{renderExamples({ pill: true })}</Fragment>)
  .add('Outlined badges', () => (
    <Fragment>{renderExamples({ outline: true })}</Fragment>
  ))
  .add('Outlined pill badges', () => (
    <Fragment>{renderExamples({ pill: true, outline: true })}</Fragment>
  ))
  .add('Links', () => <Fragment>{renderExamples({ href: '#', tag: 'a' })}</Fragment>)
