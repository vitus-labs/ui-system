import { get, pick, useStableValue } from '@vitus-labs/core'
import { context } from '@vitus-labs/unistyle'
import { useContext, useMemo } from 'react'
import { CONTEXT_KEYS } from '~/constants'
import type { Context, Obj, ValueType } from '~/types'

/**
 * Resolves grid columns and container width using a three-layer fallback:
 * 1. Explicit component props (e.g. `columns={6}`)
 * 2. `theme.grid.columns` / `theme.grid.container`
 * 3. `theme.coolgrid.columns` / `theme.coolgrid.container`
 */
type GetGridContext = (
  props: Obj,
  theme: Obj,
) => {
  columns?: ValueType
  containerWidth?: Record<string, number>
}

export const getGridContext: GetGridContext = (props = {}, theme = {}) => ({
  // `props` is always a plain object (callers pass a `pick()` result or a
  // user-supplied object literal), so direct property access is safe and
  // skips `get`'s path-parsing for these single-key lookups.
  columns: ((props as Obj).columns ||
    get(theme, 'grid.columns') ||
    get(theme, 'coolgrid.columns')) as ValueType,
  containerWidth: ((props as Obj).width ||
    get(theme, 'grid.container') ||
    get(theme, 'coolgrid.container')) as Record<string, number>,
})

/**
 * Hook that reads the unistyle theme context and merges it with the
 * component's own props to produce the final grid configuration.
 * Applies the three-layer resolution (props -> grid.* -> coolgrid.*).
 *
 * Most call sites pass an inline-spread object (`{ ...parentCtx, ...props }`)
 * so the input reference is fresh every render. `useStableValue` collapses
 * that to a content-stable reference so downstream `useMemo` actually
 * caches; without it the returned object would be a fresh ref every render
 * and any consumer keying off identity (e.g. native `RNparentWidth`-driven
 * layout) would churn.
 */
type UseGridContext = (props: Obj) => Context
const useGridContext: UseGridContext = (props) => {
  const { theme } = useContext(context)
  const stableCtxProps = useStableValue(
    pick(props, CONTEXT_KEYS as Array<keyof typeof props>) as Obj,
  )
  return useMemo(() => {
    const gridContext = getGridContext(
      stableCtxProps,
      theme as Record<string, unknown>,
    )
    return { ...gridContext, ...stableCtxProps }
  }, [stableCtxProps, theme])
}

export default useGridContext
