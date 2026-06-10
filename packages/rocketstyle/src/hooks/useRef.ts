import { type ForwardedRef, useCallback } from 'react'

type UseRocketstyleRef = (props: {
  $rocketstyleRef?: ForwardedRef<unknown>
  ref?: ForwardedRef<unknown>
}) => ForwardedRef<unknown>

const assignRef = (
  target: ForwardedRef<unknown> | undefined,
  node: unknown,
) => {
  if (!target) return
  if (typeof target === 'function') target(node)
  else target.current = node
}

/**
 * Unifies two forwarded refs (the outer consumer ref and the internal
 * rocketstyle HOC ref) into a single merged CALLBACK ref.
 *
 * React re-invokes a callback ref on every attach/detach, so both forwarded
 * refs always track the live node — including across host remounts (e.g. a
 * `tag` change). The previous `useImperativeHandle(ref, () =>
 * internalRef.current, [])` snapshotted `.current` once at mount, leaving
 * consumers holding the detached old node after a remount.
 */
const useRocketstyleRef: UseRocketstyleRef = ({ $rocketstyleRef, ref }) =>
  useCallback(
    (node: unknown) => {
      assignRef($rocketstyleRef, node)
      assignRef(ref, node)
    },
    [$rocketstyleRef, ref],
  )

export default useRocketstyleRef
