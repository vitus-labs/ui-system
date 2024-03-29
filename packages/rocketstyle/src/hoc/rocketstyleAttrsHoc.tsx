/* eslint-disable no-underscore-dangle */
import React, {
  forwardRef,
  type ForwardRefExoticComponent,
  type ComponentType,
} from 'react'
import { render } from '@vitus-labs/core'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'
import { useTheme } from '~/hooks'
import type { Configuration } from '~/types/configuration'

export type RocketStyleHOC = ({
  inversed,
  attrs,
  priorityAttrs,
}: Pick<Configuration, 'inversed' | 'attrs' | 'priorityAttrs'>) => (
  WrappedComponent: ComponentType<any>,
) => ForwardRefExoticComponent<any>

const rocketStyleHOC: RocketStyleHOC = ({ inversed, attrs, priorityAttrs }) => {
  // --------------------------------------------------
  // .attrs(...)
  // first we need to calculate final props which are
  // being returned by using `attr` chaining method
  // --------------------------------------------------
  const calculateAttrs = calculateChainOptions(attrs)
  const calculatePriorityAttrs = calculateChainOptions(priorityAttrs)

  const Enhanced = (WrappedComponent: ComponentType<any>) =>
    forwardRef<any, any>((props, ref) => {
      const { theme, mode, isDark, isLight } = useTheme({
        inversed,
      })

      const callbackParams = [theme, { render, mode, isDark, isLight }]

      // --------------------------------------------------
      // remove undefined props not to override potential default props
      // only props with value (e.g. `null`) should override default props
      // --------------------------------------------------
      const filteredProps = removeUndefinedProps(props)

      const prioritizedAttrs = calculatePriorityAttrs([
        filteredProps,
        ...callbackParams,
      ])

      const finalAttrs = calculateAttrs([
        {
          ...prioritizedAttrs,
          ...filteredProps,
        },
        ...callbackParams,
      ])

      return (
        <WrappedComponent
          $rocketstyleRef={ref}
          {...prioritizedAttrs}
          {...finalAttrs}
          {...filteredProps}
        />
      )
    })

  return Enhanced
}

export default rocketStyleHOC
