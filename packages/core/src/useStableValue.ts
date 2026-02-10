import { useRef } from 'react'
import isEqual from '~/isEqual'

/**
 * Returns a referentially stable version of `value`. The returned reference
 * only changes when the value is no longer deeply equal to the previous one.
 *
 * Use this to stabilize object/array props before passing them as hook
 * dependencies, preventing unnecessary recalculations in useMemo/useEffect.
 *
 * Based on the useDeepCompareMemoize pattern from use-deep-compare.
 */
const useStableValue = <T>(value: T): T => {
  const ref = useRef(value)

  if (!isEqual(ref.current, value)) {
    ref.current = value
  }

  return ref.current
}

export default useStableValue
