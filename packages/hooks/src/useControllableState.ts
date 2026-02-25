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

  const setValue = useCallback(
    (next: any) => {
      const nextValue = typeof next === 'function' ? next(current) : next
      if (!isControlled) setInternal(nextValue)
      onChangeRef.current?.(nextValue)
    },
    [current, isControlled],
  )

  return [current, setValue]
}

export default useControllableState
