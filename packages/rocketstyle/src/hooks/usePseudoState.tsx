import { useMemo, useRef, useState } from 'react'
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
 *
 * Consumer handlers are captured in a ref so the wrapped event callbacks
 * keep stable identity across re-renders — otherwise inline arrow
 * handlers (`onClick={() => …}`) would re-create the wrappers every
 * render and defeat downstream memoization.
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

  // Ref-capture the latest consumer handlers — wrappers below stay stable.
  const latest = useRef({
    onBlur,
    onFocus,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  })
  latest.current = {
    onBlur,
    onFocus,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  }

  const events = useMemo<PseudoActions>(
    () => ({
      onMouseEnter: (e: any) => {
        setHover(true)
        latest.current.onMouseEnter?.(e)
      },
      onMouseLeave: (e: any) => {
        setHover(false)
        setPressed(false)
        latest.current.onMouseLeave?.(e)
      },
      onMouseDown: (e: any) => {
        setPressed(true)
        latest.current.onMouseDown?.(e)
      },
      onMouseUp: (e: any) => {
        setPressed(false)
        latest.current.onMouseUp?.(e)
      },
      onFocus: (e: any) => {
        setFocus(true)
        latest.current.onFocus?.(e)
      },
      onBlur: (e: any) => {
        setFocus(false)
        latest.current.onBlur?.(e)
      },
    }),
    [],
  )

  const state = useMemo(
    () => ({ hover, focus, pressed }),
    [hover, focus, pressed],
  )

  return { state, events }
}

export default usePseudoState
