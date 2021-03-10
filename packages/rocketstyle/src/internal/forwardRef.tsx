import React, { ComponentType } from 'react'

type HocForwartRef = <T>(Component: ComponentType) => ComponentType<T>
const hocForwardRef: HocForwartRef = (Component) => {
  const Enhanced = ({ $rocketForwardRef, ...props }) => (
    <Component {...props} ref={$rocketForwardRef} />
  )

  return Enhanced
}

export default hocForwardRef
