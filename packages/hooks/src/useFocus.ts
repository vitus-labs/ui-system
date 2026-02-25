import { useCallback, useState } from 'react'

export type UseFocus = (initialValue?: boolean) => {
  focused: boolean
  onFocus: () => void
  onBlur: () => void
}

/**
 * Simple focus-state hook that returns a boolean plus stable
 * `onFocus`/`onBlur` handlers ready to spread onto an element.
 */
const useFocus: UseFocus = (initial = false) => {
  const [focused, setFocused] = useState(initial)

  const onFocus = useCallback(() => setFocused(true), [])
  const onBlur = useCallback(() => setFocused(false), [])

  return { focused, onFocus, onBlur }
}

export default useFocus
