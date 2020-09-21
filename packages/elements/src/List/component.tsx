import React from 'react'
import { pick, omit } from '@vitus-labs/core'
import Base from '~/Element'
import Iterator from '~/helpers/Iterator'
import { ExtractProps } from '~/types'

type Props = {
  rootElement?: boolean
} & ExtractProps<typeof Iterator>

const Element = ({ rootElement = true, ...props }: Props) => {
  const renderedList = <Iterator {...pick(props, Iterator.RESERVED_PROPS)} />

  if (!rootElement) return renderedList

  return <Base {...omit(props, Iterator.RESERVED_PROPS)}>{renderedList}</Base>
}

Element.displayName = 'vitus-labs/elements/List'

export default Element
