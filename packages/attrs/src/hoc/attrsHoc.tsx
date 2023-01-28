/* eslint-disable no-underscore-dangle */
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  ComponentType,
} from 'react'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'
import type { Configuration } from '~/types/configuration'

export type RocketStyleHOC = ({
  attrs,
  priorityAttrs,
}: Pick<Configuration, 'attrs' | 'priorityAttrs'>) => (
  WrappedComponent: ComponentType<any>
) => ForwardRefExoticComponent<any>

const attrsHOC: RocketStyleHOC = ({ attrs, priorityAttrs }) => {
  // --------------------------------------------------
  // .attrs(...)
  // first we need to calculate final props which are
  // being returned by using `attr` chaining method
  // --------------------------------------------------
  const calculateAttrs = calculateChainOptions(attrs)
  const calculatePriorityAttrs = calculateChainOptions(priorityAttrs)

  const Enhanced = (WrappedComponent: ComponentType<any>) =>
    forwardRef<any, any>((props, ref) => {
      // --------------------------------------------------
      // remove undefined props not to override potential default props
      // only props with value (e.g. `null`) should override default props
      // --------------------------------------------------
      const filteredProps = removeUndefinedProps(props)

      const prioritizedAttrs = calculatePriorityAttrs([filteredProps])

      const finalAttrs = calculateAttrs([
        {
          ...prioritizedAttrs,
          ...filteredProps,
        },
      ])

      return (
        <WrappedComponent
          $attrsRef={ref}
          {...prioritizedAttrs}
          {...finalAttrs}
          {...filteredProps}
        />
      )
    })

  return Enhanced
}

export default attrsHOC
