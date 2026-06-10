import { type ForwardedRef, useCallback } from 'react'

type UseAttrsRef = (props: {
  $attrsRef?: ForwardedRef<unknown>
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
 * Unifies two ref sources into a single merged callback ref.
 *
 * The attrs HOC chain creates two refs that both need to reach the same DOM node:
 * - `$attrsRef`: the consumer's original ref, forwarded through attrsHoc
 * - `ref`: a ref from any intermediate HOC added via `.compose()`
 *
 * A CALLBACK ref (not `useImperativeHandle`) is essential here: React
 * re-invokes it on every attach/detach, so both forwarded refs always track
 * the live node — including across host remounts (e.g. a `tag` change from
 * `div` to `button`). The previous `useImperativeHandle(ref, () =>
 * internalRef.current, [])` implementation snapshotted `.current` once at
 * mount, leaving consumers holding the detached old node after a remount.
 *
 * Deps on the forwarded refs: if a consumer passes a new ref identity,
 * React detaches the old callback (null) and attaches the new one (node),
 * keeping both ref generations correct.
 */
const useAttrsStyleRef: UseAttrsRef = ({ $attrsRef, ref }) =>
  useCallback(
    (node: unknown) => {
      assignRef($attrsRef, node)
      assignRef(ref, node)
    },
    [$attrsRef, ref],
  )

export default useAttrsStyleRef
