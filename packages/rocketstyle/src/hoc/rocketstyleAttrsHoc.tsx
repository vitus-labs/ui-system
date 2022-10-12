/* eslint-disable no-underscore-dangle */
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  ComponentType,
} from 'react'
import { render } from '@vitus-labs/core'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'
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

      // --------------------------------------------------
      // remove undefined props not to override potential default props
      // only props with value (e.g. `null`) should override default props
      // --------------------------------------------------
      const filteredProps = removeUndefinedProps(props)

      const calculatedAttrs = _calculateChainOptions([
        filteredProps,
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
          {...filteredProps}
        />
      )
    })

  return Enhanced
}

export default rocketStyleHOC
