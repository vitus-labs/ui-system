import { useState, useCallback } from 'react'
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

const usePseudoState: UsePseudoState = (props) => {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [pressed, setPressed] = useState(false)

  const onMouseEnter = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setHover(true)
      if (props.onMouseEnter) props.onMouseEnter(e)
    },
    [props.onMouseEnter]
  )

  const onMouseLeave = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setHover(false)
      if (props.onMouseLeave) props.onMouseLeave(e)
    },
    [props.onMouseLeave]
  )

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setPressed(true)
      if (props.onMouseDown) props.onMouseDown(e)
    },
    [props.onMouseDown]
  )

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setPressed(false)
      if (props.onMouseUp) props.onMouseUp(e)
    },
    [props.onMouseUp]
  )

  const onFocus = useCallback(
    (e: FocusEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setFocus(true)
      if (props.onFocus) props.onFocus(e)
    },
    [props.onFocus]
  )

  const onBlur = useCallback(
    (e: FocusEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setFocus(false)
      if (props.onBlur) props.onBlur(e)
    },
    [props.onBlur]
  )

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
