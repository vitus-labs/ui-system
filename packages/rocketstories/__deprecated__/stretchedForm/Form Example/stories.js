import theme from '../themeDecorator'
import { Form, TextInput, Submit } from '../form'

storiesOf('ROCKETSTYLE | Stretched children', module)
  .addDecorator(theme)
  .add('Form - Stretched ', () => {
    return (
      <Form contentAlignX="stretch">
        <TextInput label="Username" input={{ name: 'username' }} meta={{}} />
        <TextInput label="Password" input={{ name: 'password' }} meta={{}} />
        <Submit label="Submit" />
      </Form>
    )
  })
