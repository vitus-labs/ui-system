// import { FC } from 'react'
import { extendedCss } from '@vitus-labs/unistyle'
import { ComponentType } from 'react'

// export type ElementType<
//   P extends Record<string, unknown> = Record<string, unknown>
// > = FC<P & Props>

export type Obj = Record<string, unknown>
export type Value = number | string
export type Css = Parameters<typeof extendedCss>[0]
export type ExtendCss = Css | Record<string, Css> | Array<Css>

export type ValueType = number | Record<string, number> | Array<number>

export type ConfigurationProps = Partial<{
  size: ValueType
  padding: ValueType
  gap: ValueType
  gutter: ValueType
  columns: ValueType
}>

export type CtxCss = {
  colCss: ExtendCss
  rowCss: ExtendCss
  colComponent: ComponentType
  rowComponent: ComponentType
  containerWidth: ValueType
}

export type Context = Partial<ConfigurationProps & CtxCss>
