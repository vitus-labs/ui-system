import React from 'react'
import { SimpleHoc } from '~/types'

const hocForwardRef: SimpleHoc = (Component) => {
  const Enhanced = ({ $rocketForwardRef, ...props }: any) => (
    <Component {...props} ref={$rocketForwardRef} />
  )

  return Enhanced
}

export default hocForwardRef
