import { type ForwardedRef, useImperativeHandle, useRef } from 'react'

type UseRocketstyleRef = (props: {
  $rocketstyleRef?: ForwardedRef<unknown>
  ref?: ForwardedRef<unknown>
}) => ForwardedRef<unknown>

/**
 * Unifies two forwarded refs (the outer consumer ref and the internal
 * rocketstyle HOC ref) into a single internal ref using `useImperativeHandle`,
 * so both callers receive the same underlying DOM node.
 */
const useRocketstyleRef: UseRocketstyleRef = ({ $rocketstyleRef, ref }) => {
  const internalRef = useRef(null)

  useImperativeHandle($rocketstyleRef, () => internalRef.current)
  useImperativeHandle(ref, () => internalRef.current)

  return internalRef
}

export default useRocketstyleRef
