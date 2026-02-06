import { type ForwardedRef, useImperativeHandle, useRef } from 'react'

type UseRocketstyleRef = (props: {
  $rocketstyleRef?: ForwardedRef<unknown>
  ref?: ForwardedRef<unknown>
}) => ForwardedRef<unknown>

const useRocketstyleRef: UseRocketstyleRef = ({ $rocketstyleRef, ref }) => {
  const internalRef = useRef(null)

  useImperativeHandle($rocketstyleRef, () => internalRef.current)
  useImperativeHandle(ref, () => internalRef.current)

  return internalRef
}

export default useRocketstyleRef
