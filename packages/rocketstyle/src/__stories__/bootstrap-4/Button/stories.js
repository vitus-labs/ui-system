import theme from '../themeDecorator'
import Button from '.'
import ButtonGroup from '../ButtonGroup'

const STATE = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
  'link'
]

const renderExamples = props =>
  STATE.map(value => <Button label={value} {...{ [value]: true }} {...props} />)

storiesOf(Button.displayName, module)
  .addDecorator(theme)
  .add('Examples', () => <Fragment>{renderExamples()}</Fragment>)
  .add('Button tags', () => (
    <Fragment>
      <Button tag="a" href="#" label="Link" primary />
      <Button label="Button" primary />
      <Button value="Input" tag="input" type="button" primary />
      <Button value="Submit" tag="input" type="submit" primary />
      <Button value="Reset" tag="input" type="reset" primary />
    </Fragment>
  ))
  .add('Outline buttons', () => (
    <Fragment>{renderExamples({ outline: true })}</Fragment>
  ))
  .add('Outline rounded buttons', () => (
    <Fragment>{renderExamples({ outline: true, rounded: true })}</Fragment>
  ))
  .add('Outlined with size', () => (
    <Fragment>
      <Button label="Small Button" outline primary sm />
      <Button label="Normal Button" outline />
      <Button label="Large Button" outline secondary lg />
    </Fragment>
  ))
  .add('Sizes', () => (
    <Fragment>
      <Button label="Small button" primary sm />
      <Button label="Small button" secondary sm />
      <Button label="Normal button" secondary />
      <Button label="Normal button" danger />
      <Button label="Large button" primary lg />
      <Button label="Large button" success lg />
      <Button label="Block level button" block info sm />
      <Button label="Block level button" block primary />
      <Button label="Block level button" block secondary lg />
    </Fragment>
  ))
  .add('Active state', () => <Fragment>{renderExamples({ active: true })}</Fragment>)
  .add('Disabled state', () => (
    <Fragment>{renderExamples({ disabled: true })}</Fragment>
  ))
  .add('Rounded borders', () => (
    <Fragment>
      <Button label="I'm small rounded Button" primary sm rounded />
      <Button label="I'm small rounded Button" warning rounded />
      <Button label="I'm small rounded Button" secondary lg rounded />
    </Fragment>
  ))

  .add('Block', () => (
    <Fragment>
      <Button label="I'm small rounded Button" primary block />
      <Button label="I'm small rounded Button" warning block rounded />
      <Button label="I'm small rounded Button" secondary lg block rounded />
    </Fragment>
  ))
  .add('Checkbox and radio buttons', () => (
    <Fragment>
      <ButtonGroup
        secondary
        injectProps
        type="single"
        data={[{ label: 'Button' }, { label: 'Button' }, { label: 'Button' }]}
        component={({ toggleItem, ...props }) => (
          <Button onClick={toggleItem} {...props} />
        )}
      />
    </Fragment>
  ))
  .add('With icons on left or right side', () => (
    <Fragment>
      <Button primary beforeContent="😎" label="I'm button with icon before" />
      <Button success afterContent="👍" label="I'm button with icon after" />
      <Button warning afterContent="💯" label="I'm button with icon after" />
      <Button rounded beforeContent="😎" label="I'm button with icon before" />
      <Button
        primary
        rounded
        beforeContent="😎"
        label="I'm button with icon before"
      />
      <Button success rounded afterContent="👍" label="I'm button with icon after" />
      <Button warning rounded afterContent="💯" label="I'm button with icon after" />
      <Button
        beforeContent="😎"
        afterContent="👍"
        label="I'm button with icon before and after"
      />
      <Button
        primary
        beforeContent="😎"
        afterContent="👍"
        label="I'm button with icon before and after"
      />
      <Button
        success
        beforeContent="😎"
        afterContent="👍"
        label="I'm button with icon before and after"
      />
      <Button
        warning
        beforeContent="😎"
        afterContent="💯"
        label="I'm button with icon before and after"
      />
    </Fragment>
  ))
