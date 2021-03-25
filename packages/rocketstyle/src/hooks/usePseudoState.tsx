import { useState } from 'react'
import type { PseudoActions, PseudoState } from '~/types'

type State = Omit<PseudoState, 'active'>

type UsePseudoState = ({
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
}: Partial<PseudoActions>) => { state: State; events: PseudoActions }

const handleEvent = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
}

const usePseudoState: UsePseudoState = (props) => {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [pressed, setPressed] = useState(false)

  const onMouseEnter = (e: MouseEvent) => {
    handleEvent(e)
    setHover(true)
    if (props.onMouseEnter) props.onMouseEnter(e)
  }

  const onMouseLeave = (e: MouseEvent) => {
    handleEvent(e)
    setHover(false)
    setPressed(false)
    if (props.onMouseLeave) props.onMouseLeave(e)
  }

  const onMouseDown = (e: MouseEvent) => {
    handleEvent(e)
    setPressed(true)
    if (props.onMouseDown) props.onMouseDown(e)
  }

  const onMouseUp = (e: MouseEvent) => {
    handleEvent(e)
    setPressed(false)
    if (props.onMouseUp) props.onMouseUp(e)
  }

  const onFocus = (e: FocusEvent) => {
    handleEvent(e)
    setFocus(true)
    if (props.onFocus) props.onFocus(e)
  }

  const onBlur = (e: FocusEvent) => {
    handleEvent(e)
    setFocus(false)
    if (props.onBlur) props.onBlur(e)
  }

  return {
    state: {
      hover,
      focus,
      pressed,
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

export default usePseudoState
