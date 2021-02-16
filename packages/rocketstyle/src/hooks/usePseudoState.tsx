import { useState } from 'react'
import type { MouseAction, FocusAction } from '~/types'

type Props = {
  onMouseEnter: MouseAction
  onMouseLeave: MouseAction
  onMouseDown: MouseAction
  onMouseUp: MouseAction
  onFocus: FocusAction
  onBlur: FocusAction
}

type PseudoState = { hover: boolean; focus: boolean; pressed: boolean }

type UsePseudoState = ({
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
}: Partial<Props>) => { state: PseudoState; events: Props }

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
