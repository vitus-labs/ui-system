import { useState, useCallback } from 'react'
import type { PseudoActions, PseudoState } from '~/types/pseudo'

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

  const onMouseEnter = useCallback(
    (e: MouseEvent) => {
      handleEvent(e)
      setHover(true)
      if (props.onMouseEnter) props.onMouseEnter(e)
    },
    [props.onMouseEnter]
  )

  const onMouseLeave = useCallback(
    (e: MouseEvent) => {
      handleEvent(e)
      setHover(false)
      setPressed(false)
      if (props.onMouseLeave) props.onMouseLeave(e)
    },
    [props.onMouseLeave]
  )

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      handleEvent(e)
      setPressed(true)
      if (props.onMouseDown) props.onMouseDown(e)
    },
    [props.onMouseDown]
  )

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      handleEvent(e)
      setPressed(false)
      if (props.onMouseUp) props.onMouseUp(e)
    },
    [props.onMouseUp]
  )

  const onFocus = useCallback(
    (e: FocusEvent) => {
      handleEvent(e)
      setFocus(true)
      if (props.onFocus) props.onFocus(e)
    },
    [props.onFocus]
  )

  const onBlur = useCallback(
    (e: FocusEvent) => {
      handleEvent(e)
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
