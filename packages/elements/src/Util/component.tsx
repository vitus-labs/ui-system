import { forwardRef, ReactNode } from 'react'
import { renderContent } from '@vitus-labs/core'

const parseJSON = (object) => {
  let result = {}
  try {
    result = JSON.parse(object)
  } catch (e) {}

  return result
}

interface Props {
  children: ReactNode
  className?: string | string[]
  style?: object
}

const Element = forwardRef<any, Props>(
  ({ children, className, style }, ref) => {
    const passProps = parseJSON(
      JSON.stringify({
        className,
        style,
        ref,
      })
    )

    return renderContent(children, passProps)
  }
)

Element.displayName = 'vitus-labs/elements/Util'
export default Element
