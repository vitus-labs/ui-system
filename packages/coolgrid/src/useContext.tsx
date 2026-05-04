import { get, pick, useStableValue } from '@vitus-labs/core'
import { context } from '@vitus-labs/unistyle'
import { useContext, useMemo } from 'react'
import { CONTEXT_KEYS } from '~/constants'
import type { Context, Obj, ValueType } from '~/types'

/**
 * Picks only the recognized grid configuration keys from a props object,
 * filtering out any non-grid props before they enter context resolution.
 */
export type PickThemeProps = <T extends Record<string, unknown>>(
  props: T,
  keywords: Array<keyof T>,
) => ReturnType<typeof pick>
const pickThemeProps: PickThemeProps = (props, keywords) =>
  pick(props, keywords)

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
  columns: (get(props, 'columns') ||
    get(theme, 'grid.columns') ||
    get(theme, 'coolgrid.columns')) as ValueType,
  containerWidth: (get(props, 'width') ||
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
    pickThemeProps(props, CONTEXT_KEYS) as Obj,
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
