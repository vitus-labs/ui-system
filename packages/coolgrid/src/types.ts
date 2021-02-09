import { ReactText, ComponentType } from 'react'
import { extendedCss } from '@vitus-labs/unistyle'

// export type ElementType<
//   P extends Record<string, unknown> = Record<string, unknown>
// > = FC<P & Props>

type CreateValueType<T> = T | Record<string, T> | Array<T>

export type Obj = Record<string, unknown>
export type Value = ReactText
export type Css = Parameters<typeof extendedCss>[0]
export type ExtendCss = Css | Record<string, Css> | Array<Css>

export type ValueType = CreateValueType<number>
export type ContainerWidth = CreateValueType<Value>

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
