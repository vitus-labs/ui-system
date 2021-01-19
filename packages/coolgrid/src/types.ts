// import { FC } from 'react'
import { extendedCss } from '@vitus-labs/unistyle'
import { ComponentType } from 'react'

// export type ElementType<
//   P extends Record<string, unknown> = Record<string, unknown>
// > = FC<P & Props>

export type Obj = Record<string, unknown>
export type Value = number | string
export type Css = Parameters<typeof extendedCss>[0]

export type ValueType = number | Record<string, number> | Array<number>

export type ConfigurationProps = Partial<{
  size: ValueType
  padding: ValueType
  gap: ValueType
  gutter: ValueType
  columns: number
}>

export type CtxCss = {
  colCss: Css
  rowCss: Css
  colComponent: ComponentType
  rowComponent: ComponentType
  containerWidth: Value
}

export type Context = Partial<ConfigurationProps & CtxCss>
