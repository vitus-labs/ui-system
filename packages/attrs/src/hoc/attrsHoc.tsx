import { useStableValue } from '@vitus-labs/core'
import { type ComponentType, type FC, useMemo } from 'react'
import type { Configuration } from '~/types/configuration'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'

export type AttrsStyleHOC = ({
  attrs,
  priorityAttrs,
}: Pick<Configuration, 'attrs' | 'priorityAttrs'>) => (
  WrappedComponent: ComponentType<any>,
) => FC<any>

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
  // Most components never call .attrs() — short-circuit the merge work below.
  const hasAttrs = (attrs?.length ?? 0) > 0
  const hasPriorityAttrs = (priorityAttrs?.length ?? 0) > 0
  const hasAnyChain = hasAttrs || hasPriorityAttrs

  const attrsHoc = (WrappedComponent: ComponentType<any>) => {
    const HOC = (allProps: any) => {
      const { ref, ...props } = allProps

      // React produces a fresh props object on every render — using `[props]`
      // as a useMemo dep array therefore never hits and downstream memos
      // cascade-invalidate. Stabilize by deep-equal content so the dep stays
      // referentially identical across content-equal re-renders.
      const stableProps = useStableValue(props)
      const filteredProps = useMemo(
        () => removeUndefinedProps(stableProps),
        [stableProps],
      )

      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: fast-path branching deliberately inlined for hot render path
      const finalProps = useMemo(() => {
        // Fast path: no attrs configured — skip the 3 spread allocations.
        if (!hasAnyChain) {
          return { $attrsRef: ref, ...filteredProps }
        }
        // 1. Resolve priority attrs (lowest precedence defaults).
        const prioritizedAttrs = hasPriorityAttrs
          ? calculatePriorityAttrs([filteredProps])
          : null
        // 2. Resolve normal attrs — these see priority + explicit props as input.
        const finalAttrs = hasAttrs
          ? calculateAttrs([
              prioritizedAttrs
                ? { ...prioritizedAttrs, ...filteredProps }
                : filteredProps,
            ])
          : null

        // 3. Merge: priority < normal attrs < explicit props (last wins).
        return {
          $attrsRef: ref,
          ...prioritizedAttrs,
          ...finalAttrs,
          ...filteredProps,
        }
      }, [filteredProps, ref])

      return <WrappedComponent {...finalProps} />
    }
    return HOC
  }

  return attrsHoc
}

export default createAttrsHOC
