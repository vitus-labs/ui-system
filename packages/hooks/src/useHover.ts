import { useCallback, useState } from 'react'

export type UseHover = (initialValue?: boolean) => {
  hover: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

/**
 * Simple hover-state hook that returns a boolean plus stable
 * `onMouseEnter`/`onMouseLeave` handlers ready to spread onto an element.
 */
const useHover: UseHover = (initial = false) => {
  const [hover, handleHover] = useState(initial)

  const setHover = useCallback(() => handleHover(true), [])
  const unsetHover = useCallback(() => handleHover(false), [])

  return {
    hover,
    onMouseEnter: setHover,
    onMouseLeave: unsetHover,
  }
}

export default useHover
