import {
  useState,
  useCallback,
  SyntheticEvent,
  MouseEventHandler,
  FocusEventHandler,
} from 'react'
import type { PseudoActions, PseudoState } from '~/types/pseudo'

type UsePseudoState = ({
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
}: Partial<PseudoActions>) => {
  state: Omit<PseudoState, 'active'>
  events: PseudoActions
}

const handleEvent = (e: SyntheticEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const usePseudoState: UsePseudoState = ({
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}) => {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handleOnMouseEnter: MouseEventHandler = useCallback(
    (e) => {
      handleEvent(e)
      setHover(true)
      if (onMouseEnter) onMouseEnter(e)
    },
    [onMouseEnter]
  )

  const handleOnMouseLeave: MouseEventHandler = useCallback(
    (e) => {
      handleEvent(e)
      setHover(false)
      setPressed(false)
      if (onMouseLeave) onMouseLeave(e)
    },
    [onMouseLeave]
  )

  const handleOnMouseDown: MouseEventHandler = useCallback(
    (e) => {
      handleEvent(e)
      setPressed(true)
      if (onMouseDown) onMouseDown(e)
    },
    [onMouseDown]
  )

  const handleOnMouseUp: MouseEventHandler = useCallback(
    (e) => {
      handleEvent(e)
      setPressed(false)
      if (onMouseUp) onMouseUp(e)
    },
    [onMouseUp]
  )

  const handleOnFocus: FocusEventHandler = useCallback(
    (e) => {
      handleEvent(e)
      setFocus(true)
      if (onFocus) onFocus(e)
    },
    [onFocus]
  )

  const handleOnBlur: FocusEventHandler = useCallback(
    (e) => {
      handleEvent(e)
      setFocus(false)
      if (onBlur) onBlur(e)
    },
    [onBlur]
  )

  return {
    state: {
      hover,
      focus,
      pressed,
    },
    events: {
      onMouseEnter: handleOnMouseEnter,
      onMouseLeave: handleOnMouseLeave,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onFocus: handleOnFocus,
      onBlur: handleOnBlur,
    },
  }
}

export default usePseudoState
