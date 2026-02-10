import {
  type FocusEventHandler,
  type MouseEventHandler,
  useCallback,
  useMemo,
  useState,
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
  state: Pick<PseudoState, 'hover' | 'focus' | 'pressed'>
  events: PseudoActions
}

/**
 * Tracks hover, focus, and pressed pseudo-states via mouse and focus
 * event handlers. Returns the current state flags and wrapped event
 * callbacks that preserve any user-provided handlers.
 */
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
      setHover(true)
      if (onMouseEnter) onMouseEnter(e)
    },
    [onMouseEnter],
  )

  const handleOnMouseLeave: MouseEventHandler = useCallback(
    (e) => {
      setHover(false)
      setPressed(false)
      if (onMouseLeave) onMouseLeave(e)
    },
    [onMouseLeave],
  )

  const handleOnMouseDown: MouseEventHandler = useCallback(
    (e) => {
      setPressed(true)
      if (onMouseDown) onMouseDown(e)
    },
    [onMouseDown],
  )

  const handleOnMouseUp: MouseEventHandler = useCallback(
    (e) => {
      setPressed(false)
      if (onMouseUp) onMouseUp(e)
    },
    [onMouseUp],
  )

  const handleOnFocus: FocusEventHandler = useCallback(
    (e) => {
      setFocus(true)
      if (onFocus) onFocus(e)
    },
    [onFocus],
  )

  const handleOnBlur: FocusEventHandler = useCallback(
    (e) => {
      setFocus(false)
      if (onBlur) onBlur(e)
    },
    [onBlur],
  )

  const state = useMemo(
    () => ({ hover, focus, pressed }),
    [hover, focus, pressed],
  )

  const events = useMemo(
    () => ({
      onMouseEnter: handleOnMouseEnter,
      onMouseLeave: handleOnMouseLeave,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onFocus: handleOnFocus,
      onBlur: handleOnBlur,
    }),
    [
      handleOnMouseEnter,
      handleOnMouseLeave,
      handleOnMouseDown,
      handleOnMouseUp,
      handleOnFocus,
      handleOnBlur,
    ],
  )

  return { state, events }
}

export default usePseudoState
