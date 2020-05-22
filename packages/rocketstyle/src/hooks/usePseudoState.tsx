import { useState } from 'react'

// const STATE_HANDLERS = [
//   'setHover',
//   'unsetHover',
//   'setPressed',
//   'unsetPressed',
//   'setFocus',
//   'unsetFocus',
// ]

// const RESERVED_KEYS = [
//   'onMouseEnter',
//   'onMouseLeave',
//   'onMouseDown',
//   'onMouseUp',
//   'onFocus',
//   'onBlur',
// ]

export default (props) => {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [pressed, setPressed] = useState(false)

  const onMouseEnter = (e) => {
    setHover(true)
    if (props.onMouseEnter) props.onMouseEnter(e)
  }

  const onMouseLeave = (e) => {
    setHover(false)
    if (props.onMouseLeave) props.onMouseLeave(e)
  }

  const onMouseDown = (e) => {
    setPressed(true)
    if (props.onMouseDown) props.onMouseDown(e)
  }

  const onMouseUp = (e) => {
    setPressed(false)
    if (props.onMouseUp) props.onMouseUp(e)
  }

  const onFocus = (e) => {
    setFocus(true)
    if (props.onFocus) props.onFocus(e)
  }

  const onBlur = (e) => {
    setFocus(false)
    if (props.onBlur) props.onBlur(e)
  }

  return {
    pseudoState: {
      hover,
      focus,
      pressed,
    },
    pseudoEvents: {
      setHover,
      setFocus,
      setPressed,
    },
    events: {
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
    },
  }
}
