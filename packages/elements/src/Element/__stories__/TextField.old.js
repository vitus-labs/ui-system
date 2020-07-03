import Element from '~/Element'
import TextField from './TextField'

storiesOf('ELEMENTS | Element', module).add('Text Field', () => {
  return <TextField label="This is a Text Field" placeholder="Type something..." />
})
