import theme from '../themeDecorator'
import Navigation from '.'

const data = [
  { label: 'Active', href: '#', active: true },
  { label: 'Link', href: '#' },
  { label: 'Link', href: '#' },
  { label: 'Disabled', href: '#', disabled: true }
]

storiesOf(Navigation.displayName, module)
  .addDecorator(theme)
  .add('Base nav', () => (
    <Fragment>
      <Navigation data={data} />
      <Navigation data={data} />
      <Navigation data={data} />
    </Fragment>
  ))
  .add('Vertical', () => (
    <Fragment>
      <Navigation vertical data={data} />
      <Navigation vertical data={data} />
      <Navigation vertical data={data} />
    </Fragment>
  ))
  .add('Tabs', () => (
    <Fragment>
      <Navigation tabs data={data} />
    </Fragment>
  ))
  .add('Pills', () => (
    <Fragment>
      <Navigation pills data={data} />
    </Fragment>
  ))
