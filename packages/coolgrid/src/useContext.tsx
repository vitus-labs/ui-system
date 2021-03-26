import { useContext } from 'react'
import { get, pick } from '@vitus-labs/core'
import { context } from '@vitus-labs/unistyle'
import { CONTEXT_KEYS } from '~/constants'
import { Obj, ValueType, Context } from '~/types'

// ------------------------------------------
// pickTheme props
// ------------------------------------------
export type PickThemeProps = <T extends Record<string, unknown>>(
  props: T,
  keywords: Array<keyof T>
) => ReturnType<typeof pick>
const pickThemeProps: PickThemeProps = (props, keywords) =>
  pick(props, keywords)

// ------------------------------------------
// create grid settings
// ------------------------------------------
type GetGridContext = (
  props: Obj,
  theme: Obj
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

type UseGridContext = (props: Obj) => Context
const useGridContext: UseGridContext = (props) => {
  const { theme } = useContext(context)
  const ctxProps = pickThemeProps(props, CONTEXT_KEYS)
  const gridContext = getGridContext(ctxProps, theme as Record<string, unknown>)

  return { ...gridContext, ...ctxProps }
}

export default useGridContext
