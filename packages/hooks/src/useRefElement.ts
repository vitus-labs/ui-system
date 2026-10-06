import { type RefObject, useState } from 'react'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

/**
 * Internal: tracks `ref.current` as state so effects can (re)subscribe when
 * the element mounts late (`{open && <div ref={r} />}`) or is swapped.
 * Re-checks after every commit; bails out when the identity is unchanged.
 */
const useRefElement = <T>(
  ref: RefObject<T | null> | { current: T | null } | null | undefined,
): T | null => {
  const [node, setNode] = useState<T | null>(ref ? ref.current : null)

  useIsomorphicLayoutEffect(() => {
    const next = ref ? ref.current : null
    if (next !== node) setNode(next)
  })

  return node
}

export default useRefElement
