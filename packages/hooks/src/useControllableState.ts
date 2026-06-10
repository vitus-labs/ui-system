import { useCallback, useRef, useState } from 'react'

type UseControllableStateOptions<T> = {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}

export type UseControllableState = <T>(
  options: UseControllableStateOptions<T>,
) => [T, (next: T | ((prev: T) => T)) => void]

/**
 * Unified controlled/uncontrolled state pattern.
 * When `value` is provided the component is controlled; otherwise
 * internal state is used with `defaultValue` as the initial value.
 * The `onChange` callback fires in both modes.
 */
const useControllableState: UseControllableState = ({
  value,
  defaultValue,
  onChange,
}) => {
  const [internal, setInternal] = useState(defaultValue)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  // Tracks the freshest value so consecutive or stale-closure functional
  // updates compute from the latest value, not the render-captured one
  const currentRef = useRef(current)
  currentRef.current = current

  const setValue = useCallback(
    (next: any) => {
      const nextValue =
        typeof next === 'function' ? next(currentRef.current) : next
      currentRef.current = nextValue
      // Route updates through React untouched so functional updates
      // receive the latest state even when batched
      if (!isControlled) setInternal(next)
      onChangeRef.current?.(nextValue)
    },
    [isControlled],
  )

  return [current, setValue]
}

export default useControllableState
