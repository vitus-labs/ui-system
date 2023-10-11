import { useRef, useImperativeHandle, type ForwardedRef } from 'react'

type UseAttrsRef = (props: {
  $attrsRef?: ForwardedRef<unknown>
  ref?: ForwardedRef<unknown>
}) => ForwardedRef<unknown>

const useAttrsStyleRef: UseAttrsRef = ({ $attrsRef, ref }) => {
  const internalRef = useRef(null)

  useImperativeHandle($attrsRef, () => internalRef.current)
  useImperativeHandle(ref, () => internalRef.current)

  return internalRef
}

export default useAttrsStyleRef
