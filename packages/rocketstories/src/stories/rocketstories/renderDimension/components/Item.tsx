import React, { createElement, VFC } from 'react'
import { Heading } from '~/components/base'
import { useContext } from '../context'

type Props = {
  title?: string
} & { [key: string]: any }

const component: VFC<Props> = ({ title, ...props }) => {
  const { component } = useContext()

  return (
    <div>
      {title && <Heading level2 label={title} />}
      {createElement(component, props)}
    </div>
  )
}

export default component
