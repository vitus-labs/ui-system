import { render } from '@vitus-labs/core'
import { type ReactNode, useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import type { VLComponent } from '~/types'

export interface Props {
  /**
   * Children to be rendered within **Util** component.
   */
  children: ReactNode
  /**
   * Class name(s) to be added to children component.
   */
  className?: string | string[]
  /**
   * Style property to extend children component inline styles
   */
  style?: Record<string, unknown>
}

const Component: VLComponent<Props> = ({ children, className, style }) => {
  const mergedClasses = useMemo(
    () => (Array.isArray(className) ? className.join(' ') : className),
    [className],
  )

  const finalProps: Record<string, any> = {}
  if (style) finalProps.style = style
  if (mergedClasses) finalProps.className = mergedClasses

  return render(children, finalProps)
}

const name = `${PKG_NAME}/Util` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
