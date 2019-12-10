import theme from '../themeDecorator'
import Link from '.'

storiesOf(Link.displayName, module)
  .addDecorator(theme)
  .add('with different state', () => (
    <Fragment>
      <Link label="I am a link!" href="#" />
      <Link primary label="I am a link!" href="#" />
      <Link secondary label="I am a link!" href="#" />
      <Link success label="I am a link!" href="#" />
      <Link danger label="I am a link!" href="#" />
      <Link warning label="I am a link!" href="#" />
      <Link info label="I am a link!" href="#" />
      <Link light label="I am a link!" href="#" />
      <Link dark label="I am a link!" href="#" />
    </Fragment>
  ))
