import { renderContent } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import { VLComponent } from '~/types'

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

const component: VLComponent<Props> = ({ children, className, style }) => {
  const passProps = parseJSON(
    JSON.stringify({
      className,
      style,
    })
  )

  return renderContent(children, passProps)
}

const name = `${PKG_NAME}/Element` as const

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name

export default component
