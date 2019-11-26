export type activeItemsMap = Map<string | number, boolean>
export type activeItems = activeItemsMap | number | string
export type key = string | number
export type status = boolean

export interface Props {
  type?: 'simple' | 'single' | 'multi'
  activeItems?: string | number | string[] | number[]
  children?: React.ReactNode
  itemKey?: () => key
  injectProps?: boolean
  component?: Function | React.ReactNode | object
  data?: any[]
  itemProps?: Object
}

export interface State {
  activeItems?: activeItemsMap | number | string
}
