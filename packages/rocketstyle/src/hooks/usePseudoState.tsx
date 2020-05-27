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

export default () => {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [pressed, setPressed] = useState(false)

  const onMouseEnter = () => {
    setHover(true)
  }

  const onMouseLeave = () => {
    setHover(false)
  }

  const onMouseDown = () => {
    setPressed(true)
  }

  const onMouseUp = () => {
    setPressed(false)
  }

  const onFocus = () => {
    setFocus(true)
  }

  const onBlur = () => {
    setFocus(false)
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
