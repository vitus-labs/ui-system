export type MouseAction = (e: MouseEvent) => void
export type FocusAction = (e: FocusEvent) => void

export type PseudoActions = {
  onMouseEnter: MouseAction
  onMouseLeave: MouseAction
  onMouseDown: MouseAction
  onMouseUp: MouseAction
  onFocus: FocusAction
  onBlur: FocusAction
}

export type PseudoState = {
  active: boolean
  hover: boolean
  focus: boolean
  pressed: boolean
}

export type PseudoProps = Partial<PseudoActions & PseudoState>
