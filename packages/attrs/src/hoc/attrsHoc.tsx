import {
  type ComponentType,
  type ForwardRefExoticComponent,
  forwardRef,
  useMemo,
} from 'react'
import type { Configuration } from '~/types/configuration'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'

export type AttrsStyleHOC = ({
  attrs,
  priorityAttrs,
}: Pick<Configuration, 'attrs' | 'priorityAttrs'>) => (
  WrappedComponent: ComponentType<any>,
) => ForwardRefExoticComponent<any>

/**
 * Creates the core HOC that computes default props from the `.attrs()` chain.
 *
 * This is always the outermost HOC in the compose chain, so it runs first.
 * It resolves both priority and normal attrs callbacks, then merges them
 * with the consumer's explicit props following this precedence:
 *
 *   priorityAttrs < normalAttrs < explicit props  (last wins)
 *
 * The consumer's `ref` is forwarded as `$attrsRef` through the rest of the
 * HOC chain, since intermediate HOCs may need their own `ref`.
 */
const createAttrsHOC: AttrsStyleHOC = ({ attrs, priorityAttrs }) => {
  // Pre-build the chain reducers once (not per render).
  const calculateAttrs = calculateChainOptions(attrs)
  const calculatePriorityAttrs = calculateChainOptions(priorityAttrs)

  const attrsHoc = (WrappedComponent: ComponentType<any>) =>
    forwardRef<any, any>((props, ref) => {
      // Strip undefined values so they don't shadow defaults from attrs callbacks.
      // Only explicitly set values (including `null`) should override defaults.
      const filteredProps = useMemo(() => removeUndefinedProps(props), [props])

      const finalProps = useMemo(() => {
        // 1. Resolve priority attrs (lowest precedence defaults).
        const prioritizedAttrs = calculatePriorityAttrs([filteredProps])
        // 2. Resolve normal attrs — these see priority + explicit props as input.
        const finalAttrs = calculateAttrs([
          {
            ...prioritizedAttrs,
            ...filteredProps,
          },
        ])

        // 3. Merge: priority < normal attrs < explicit props (last wins).
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
