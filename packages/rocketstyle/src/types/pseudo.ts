import type { MouseEventHandler, FocusEventHandler } from 'react'

export type PseudoActions = {
  onMouseEnter: MouseEventHandler
  onMouseLeave: MouseEventHandler
  onMouseDown: MouseEventHandler
  onMouseUp: MouseEventHandler
  onFocus: FocusEventHandler
  onBlur: FocusEventHandler
}

export type PseudoState = {
  active: boolean
  hover: boolean
  focus: boolean
  pressed: boolean
  disabled: boolean
  readOnly: boolean
}

export type PseudoProps = Partial<PseudoState & PseudoActions>
