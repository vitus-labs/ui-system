/* eslint-disable no-underscore-dangle */
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  ComponentType,
} from 'react'
import { render } from '@vitus-labs/core'
import { calculateChainOptions } from '~/utils/attrs'
import { useTheme } from '~/hooks'
import type { OptionFunc } from '~/types/configuration'

export type RocketStyleHOC = ({
  inversed,
  attrs,
}: {
  inversed?: boolean
  attrs?: Array<OptionFunc>
}) => (WrappedComponent: ComponentType<any>) => ForwardRefExoticComponent<any>

const rocketStyleHOC: RocketStyleHOC = ({ inversed, attrs }) => {
  // --------------------------------------------------
  // .attrs(...)
  // first we need to calculate final props which are
  // being returned by using `attr` chaining method
  // --------------------------------------------------
  const _calculateChainOptions = calculateChainOptions(attrs)

  const Enhanced = (WrappedComponent: ComponentType<any>) =>
    forwardRef<any, any>((props, ref) => {
      const { theme, mode, isDark, isLight } = useTheme({
        inversed,
      })

      const calculatedAttrs = _calculateChainOptions([
        props,
        theme,
        {
          render,
          mode,
          isDark,
          isLight,
        },
      ])

      return (
        <WrappedComponent
          $rocketstyleRef={ref}
          {...calculatedAttrs}
          {...props}
        />
      )
    })

  return Enhanced
}

export default rocketStyleHOC
