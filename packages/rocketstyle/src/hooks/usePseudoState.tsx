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

type UsePseudoState = (
  {
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onFocus,
    onBlur,
  }: Partial<Props>,
  isProvider: boolean | unknown
) => { state: PseudoState; events: Props }

const usePseudoState: UsePseudoState = (props, isProvider) => {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [pressed, setPressed] = useState(false)

  const onMouseEnter = (e: MouseEvent) => {
    e.preventDefault()
    if (isProvider) setHover(true)
    if (props.onMouseEnter) props.onMouseEnter(e)
  }

  const onMouseLeave = (e: MouseEvent) => {
    e.preventDefault()
    if (isProvider) setHover(false)
    if (props.onMouseLeave) props.onMouseLeave(e)
  }

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    if (isProvider) setPressed(true)
    if (props.onMouseDown) props.onMouseDown(e)
  }

  const onMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    if (isProvider) setPressed(false)
    if (props.onMouseUp) props.onMouseUp(e)
  }

  const onFocus = (e: FocusEvent) => {
    e.preventDefault()
    if (isProvider) setFocus(true)
    if (props.onFocus) props.onFocus(e)
  }

  const onBlur = (e: FocusEvent) => {
    e.preventDefault()
    if (isProvider) setFocus(false)
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
