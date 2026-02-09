/* eslint-disable no-underscore-dangle */

import { render } from '@vitus-labs/core'
import {
  type ComponentType,
  type ForwardRefExoticComponent,
  forwardRef,
} from 'react'
import { useTheme } from '~/hooks'
import type { Configuration } from '~/types/configuration'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'

export type RocketStyleHOC = ({
  inversed,
  attrs,
  priorityAttrs,
}: Pick<Configuration, 'inversed' | 'attrs' | 'priorityAttrs'>) => (
  WrappedComponent: ComponentType<any>,
) => ForwardRefExoticComponent<any>

/**
 * HOC that resolves the `.attrs()` chain before the inner component renders.
 * Evaluates both regular and priority attrs callbacks with the current theme
 * and mode, then merges the results with explicit props (priority attrs
 * are applied first, regular attrs can be overridden by direct props).
 */
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
