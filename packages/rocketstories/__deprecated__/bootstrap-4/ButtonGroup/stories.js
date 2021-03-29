import theme from '../themeDecorator'
import { ButtonGroup, ButtonToolbar } from '.'
import Button from '../Button'
import Utility from '../Utils/Box'

const data = [{ label: 'Left' }, { label: 'Middle' }, { label: 'Right' }]

const nestingData = [{ label: '1' }, { label: '2' }]

storiesOf(ButtonGroup.displayName, module)
  .addDecorator(theme)
  .add('Basic example', () => (
    <Fragment>
      <ButtonGroup primary data={data} />
    </Fragment>
  ))
  .add('Button toolbar', () => (
    <Fragment>
      <ButtonToolbar>
        <Utility mr2>
          <ButtonGroup secondary data={data} />
        </Utility>
        <Utility mr2>
          <ButtonGroup secondary data={data} />
        </Utility>
        <ButtonGroup secondary data={data} />
      </ButtonToolbar>
    </Fragment>
  ))
  .add('Sizing', () => (
    <Fragment>
      <ButtonGroup sm secondary data={data} />
      <ButtonGroup secondary data={data} />
      <ButtonGroup lg secondary data={data} />
    </Fragment>
  ))
  .add('Nesting', () => (
    <Fragment>
      <ButtonGroup>
        <ButtonGroup primary data={data} />
        <ButtonGroup secondary secondary data={data} />
        <ButtonGroup success success data={data} />
        <ButtonGroup secondary data={nestingData} />
      </ButtonGroup>
    </Fragment>
  ))

  .add('Vertical variation', () => (
    <Fragment>
      <ButtonGroup secondary vertical data={data} style={{ width: '150px' }} />
      <ButtonGroup vertical secondary>
        <Button label="Button" />
        <Button label="Button" />
        <Button label="Button" />
        <Button label="Button" />
        <Button label="Button" />
        <Button label="Button" />
      </ButtonGroup>
    </Fragment>
  ))
