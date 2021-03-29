import theme from '../themeDecorator'
import Heading from '.'

storiesOf(Heading.displayName, module)
  .addDecorator(theme)
  .add('Heading Examples', () => (
    <Fragment>
      {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(value => (
        <Heading tag={value} {...{ [value]: true }}>
          Example heading
        </Heading>
      ))}
    </Fragment>
  ))
  .add('Display Heading Examples', () => (
    <Fragment>
      {['display1', 'display2', 'display3', 'display4'].map((value, i) => (
        <Heading {...{ [value]: true }}>Display {i + 1}</Heading>
      ))}
    </Fragment>
  ))
