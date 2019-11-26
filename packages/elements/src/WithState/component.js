import { Component, Children } from 'react'
import { renderContent, omit, pick } from '@vitus-labs/core'

const STATE_HANDLERS = [
  'setHover',
  'unsetHover',
  'setPressed',
  'unsetPressed',
  'setFocus',
  'unsetFocus'
]

const RESERVED_KEYS = [
  'onMouseEnter',
  'onMouseLeave',
  'onMouseDown',
  'onMouseUp',
  'onFocus',
  'onBlur'
]

export default class WithState extends Component {
  static displayName = 'vitus-labs/elements/WithState'

  state = {
    hover: false,
    focus: false,
    pressed: false
  }

  setHover = () => {
    this.setState({ hover: true })
  }

  unsetHover = () => {
    this.setState({ hover: false })
  }

  setPressed = () => {
    this.setState({ pressed: true })
  }

  unsetPressed = () => {
    this.setState({ pressed: false })
  }

  setFocus = () => {
    this.setState({ focus: true })
  }

  unsetFocus = () => {
    this.setState({ focus: false })
  }

  onMouseEnter = e => {
    this.setHover()
    if (this.props.onMouseEnter) this.props.onMouseEnter(e)
  }

  onMouseLeave = e => {
    this.unsetHover()
    if (this.props.onMouseLeave) this.props.onMouseLeave(e)
  }

  onMouseDown = e => {
    this.setPressed()
    if (this.props.onMouseDown) this.props.onMouseDown(e)
  }

  onMouseUp = e => {
    this.unsetPressed()
    if (this.props.onMouseUp) this.props.onMouseUp(e)
  }

  onFocus = e => {
    this.setFocus()
    if (this.props.onFocus) this.props.onFocus(e)
  }

  onBlur = e => {
    this.unsetFocus()
    if (this.props.onBlur) this.props.onBlur(e)
  }

  render() {
    const { children, passProps, ...props } = this.props

    return Children.only(
      renderContent(children, {
        ...(passProps ? omit(props, RESERVED_KEYS) : props),
        ...(passProps ? pick(this, RESERVED_KEYS) : {}),
        ...pick(this, STATE_HANDLERS),
        ...this.state,
        state: this.state
      })
    )
  }
}
