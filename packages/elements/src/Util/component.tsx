import { forwardRef } from 'react'
import { renderContent } from '@vitus-labs/core'

const parseJSON = (object) => {
  let result = {}
  try {
    result = JSON.parse(object)
  } catch (e) {
    // don't show error
  }

  return result
}

export type Props = {
  children: Parameters<typeof renderContent>[0]
  className?: string | string[]
  style?: Record<string, unknown>
}

const Element = forwardRef<any, Props>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
