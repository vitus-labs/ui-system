import React, {
  forwardRef,
  useMemo,
  type ForwardRefExoticComponent,
  type ComponentType,
} from 'react'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'
import type { Configuration } from '~/types/configuration'

export type AttrsStyleHOC = ({
  attrs,
  priorityAttrs,
}: Pick<Configuration, 'attrs' | 'priorityAttrs'>) => (
  WrappedComponent: ComponentType<any>,
) => ForwardRefExoticComponent<any>

const createAttrsHOC: AttrsStyleHOC = ({ attrs, priorityAttrs }) => {
  // --------------------------------------------------
  // .attrs(...)
  // first we need to calculate final props which are
  // being returned by using `attr` chaining method
  // --------------------------------------------------
  const calculateAttrs = calculateChainOptions(attrs)
  const calculatePriorityAttrs = calculateChainOptions(priorityAttrs)

  const attrsHoc = (WrappedComponent: ComponentType<any>) =>
    forwardRef<any, any>((props, ref) => {
      // --------------------------------------------------
      // remove undefined props not to override potential default props
      // only props with value (e.g. `null`) should override default props
      // --------------------------------------------------
      const filteredProps = useMemo(
        () => removeUndefinedProps(props),
        [props],
      )

      const finalProps = useMemo(() => {
        const prioritizedAttrs = calculatePriorityAttrs([filteredProps])
        const finalAttrs = calculateAttrs([
          {
            ...prioritizedAttrs,
            ...filteredProps,
          },
        ])

        return {
          $attrsRef: ref,
          ...prioritizedAttrs,
          ...finalAttrs,
          ...filteredProps,
        }
      }, [filteredProps, ref])

      return <WrappedComponent {...finalProps} />
    })

  return attrsHoc
}

export default createAttrsHOC
