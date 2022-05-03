import { useRef, useImperativeHandle } from 'react'

const useRocketstyleRef = ({ $rocketstyleRef, ref }) => {
  const internalRef = useRef(null)

  useImperativeHandle($rocketstyleRef, () => internalRef.current, [
    $rocketstyleRef,
  ])

  useImperativeHandle(ref, () => internalRef.current, [ref])

  return internalRef
}

export default useRocketstyleRef
