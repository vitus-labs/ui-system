import { useCallback, useState } from 'react'

export type UseToggle = (
  initialValue?: boolean,
) => [boolean, () => void, () => void, () => void]

/**
 * Boolean state with `toggle`, `setTrue`, and `setFalse` helpers.
 * Returns `[value, toggle, setTrue, setFalse]`.
 */
const useToggle: UseToggle = (initial = false) => {
  const [value, setValue] = useState(initial)

  const toggle = useCallback(() => setValue((v) => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [value, toggle, setTrue, setFalse]
}

export default useToggle
