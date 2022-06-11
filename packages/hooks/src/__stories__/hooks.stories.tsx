import React from 'react'
import { useWindowResize } from '..'

export default {
  component: () => null,
  title: 'Bootstrap Grid Examples',
}

export const test = () => {
  const { width } = useWindowResize()

  console.log(width)

  return <div>hell world</div>
}
