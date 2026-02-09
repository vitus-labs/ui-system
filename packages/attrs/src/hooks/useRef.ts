import { type ForwardedRef, useImperativeHandle, useRef } from 'react'

type UseAttrsRef = (props: {
  $attrsRef?: ForwardedRef<unknown>
  ref?: ForwardedRef<unknown>
}) => ForwardedRef<unknown>

/**
 * Unifies two ref sources into a single internal ref.
 *
 * The attrs HOC chain creates two refs that both need to reach the same DOM node:
 * - `$attrsRef`: the consumer's original ref, forwarded through attrsHoc
 * - `ref`: a ref from any intermediate HOC added via `.compose()`
 *
 * This hook creates one internal ref and wires both forwarded refs to it
 * via `useImperativeHandle`, so `consumer.ref.current === hoc.ref.current`.
 */
const useAttrsStyleRef: UseAttrsRef = ({ $attrsRef, ref }) => {
  const internalRef = useRef(null)

  useImperativeHandle($attrsRef, () => internalRef.current)
  useImperativeHandle(ref, () => internalRef.current)

  return internalRef
}

export default useAttrsStyleRef
