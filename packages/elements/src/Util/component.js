import { forwardRef } from 'react'
import { renderContent } from '@vitus-labs/core'

const Element = forwardRef(({ children, className, style }, ref) => {
  const passProps = JSON.parse(
    JSON.stringify({
      className,
      style,
      ref
    })
  )

  return renderContent(children, passProps)
})

Element.displayName = 'vitus-labs/elements/Util'
export default Element
