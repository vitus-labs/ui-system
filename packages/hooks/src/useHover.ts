import { useState, useCallback } from 'react'

export type UseHover = (initialValue?: boolean) => {
  hover: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

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
