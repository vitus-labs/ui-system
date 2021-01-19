import { useContext } from 'react'
import { config, get } from '@vitus-labs/core'
import { pickThemeProps } from '@vitus-labs/unistyle'
import { CONTEXT_KEYS } from '~/constants'
import { Obj, Value, Context } from '~/types'

// ------------------------------------------
// create grid settings
// ------------------------------------------
type GetGridContext = (
  props: Obj,
  theme: Obj
) => {
  columns?: number
  containerWidth?: Value | Array<Value> | Record<string, Value>
}

export const getGridContext: GetGridContext = (props = {}, theme = {}) => ({
  columns:
    get(props, 'columns') ||
    get(theme, 'grid.columns') ||
    get(theme, 'coolgrid.columns'),
  containerWidth:
    get(props, 'width') ||
    get(theme, 'grid.container') ||
    get(theme, 'coolgrid.container'),
})

type UseGridContext = (props: Obj) => Context
const useGridContext: UseGridContext = (props) => {
  const theme = useContext(config.context)
  const ctxProps = pickThemeProps(props, CONTEXT_KEYS)
  const gridContext = getGridContext(ctxProps, theme)

  return { ...gridContext, ...ctxProps }
}

export default useGridContext
