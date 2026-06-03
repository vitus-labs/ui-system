import { render, useStableValue } from '@vitus-labs/core'
import { type ComponentType, type FC, useMemo } from 'react'
import { useTheme } from '~/hooks'
import type { Configuration } from '~/types/configuration'
import { calculateChainOptions, removeUndefinedProps } from '~/utils/attrs'

export type RocketStyleHOC = ({
  inversed,
  attrs,
  priorityAttrs,
}: Pick<Configuration, 'inversed' | 'attrs' | 'priorityAttrs'>) => (
  WrappedComponent: ComponentType<any>,
) => FC<any>

/**
 * HOC that resolves the `.attrs()` chain before the inner component renders.
 * Evaluates both regular and priority attrs callbacks with the current theme
 * and mode, then merges the results with explicit props (priority attrs are
 * applied first, regular attrs can be overridden by direct props).
 *
 * Fast path: when no chain is configured (the common case for rocketstyle
 * components built with .theme()/dimensions only), skip the deep-equal
 * stabilization + memo dance and forward props directly. Mirrors the
 * pattern in @vitus-labs/attrs' attrsHoc.
 */
const rocketStyleHOC: RocketStyleHOC = ({ inversed, attrs, priorityAttrs }) => {
  const calculateAttrs = calculateChainOptions(attrs)
  const calculatePriorityAttrs = calculateChainOptions(priorityAttrs)
  const hasAttrs = (attrs?.length ?? 0) > 0
  const hasPriorityAttrs = (priorityAttrs?.length ?? 0) > 0
  const hasAnyChain = hasAttrs || hasPriorityAttrs

  // Pick the HOC variant at factory time so render-time hook count is fixed.
  if (!hasAnyChain) {
    const Enhanced = (WrappedComponent: ComponentType<any>) => {
      const HOC = ({ ref, ...props }: any) => {
        // Still call useTheme so consumers can read theme via the wrapper;
        // theme-mode flips still propagate. No attrs work to do.
        useTheme({ inversed })
        return <WrappedComponent $rocketstyleRef={ref} {...props} />
      }
      return HOC
    }
    return Enhanced
  }

  const Enhanced = (WrappedComponent: ComponentType<any>) => {
    const HOC = ({ ref, ...props }: any) => {
      const { theme, mode, isDark, isLight } = useTheme({ inversed })

      // Stabilize props so content-equal re-renders short-circuit downstream.
      const stableProps = useStableValue(props)
      const filteredProps = useMemo(
        () => removeUndefinedProps(stableProps),
        [stableProps],
      )

      // The theme-bag changes only when mode flips.
      const themeBag = useMemo(
        () => ({ render, mode, isDark, isLight }),
        [mode, isDark, isLight],
      )

      const finalProps = useMemo(() => {
        const callbackParams = [theme, themeBag] as const
        const prioritizedAttrs = hasPriorityAttrs
          ? calculatePriorityAttrs([filteredProps, ...callbackParams] as any)
          : null
        const finalAttrs = hasAttrs
          ? calculateAttrs([
              prioritizedAttrs
                ? { ...prioritizedAttrs, ...filteredProps }
                : filteredProps,
              ...callbackParams,
            ] as any)
          : null
        return {
          $rocketstyleRef: ref,
          ...prioritizedAttrs,
          ...finalAttrs,
          ...filteredProps,
        }
      }, [filteredProps, ref, theme, themeBag])

      return <WrappedComponent {...finalProps} />
    }
    return HOC
  }

  return Enhanced
}

export default rocketStyleHOC
