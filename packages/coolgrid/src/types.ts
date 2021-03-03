import { FC, ReactText, ComponentType } from 'react'
import { config } from '@vitus-labs/core'
import { extendedCss, AlignContentAlignXKeys } from '@vitus-labs/unistyle'

type CreateValueType<T> = T | Record<string, T> | Array<T>

export type Obj = Record<string, unknown>
export type Value = ReactText
export type Css = Parameters<typeof extendedCss>[0]
export type ExtendCss = Css | Record<string, Css> | Array<Css>
export type CssOutput = ReturnType<typeof config.css> | string

export type ValueType = CreateValueType<number>
export type ContainerWidth = CreateValueType<Value>

export type ContentAlignX =
  | 'center'
  | 'left'
  | 'right'
  | 'spaceAround'
  | 'spaceBetween'
  | 'spaceEvenly'

export type ConfigurationProps = Partial<{
  size: ValueType
  padding: ValueType
  gap: ValueType
  gutter: ValueType
  columns: ValueType
  colCss: ExtendCss
  rowCss: ExtendCss
  colComponent: ComponentType
  rowComponent: ComponentType
  contentAlignX: ContentAlignX
  containerWidth: ContainerWidth
  width:
    | ContainerWidth
    | ((widths: Record<string, Value>) => Record<string, Value>)
}>

export type ComponentProps = ConfigurationProps &
  Partial<{
    component: ComponentType
    css: ExtendCss
  }>

export type StyledTypes = Partial<{
  size: number
  padding: number
  gap: number
  gutter: number
  columns: number
  extendCss: Css
  RNparentWidth: any
  contentAlignX: AlignContentAlignXKeys
  width: Value
}>

// export type ElementType<O extends Array<string>> = FC<
//   Omit<HTMLProps<HTMLElement>, keyof ComponentProps> &
//     Omit<ComponentProps, O[number]> &
//     Record<string, unknown>
// >

export type ElementType<O extends Array<string>> = FC<
  Omit<ComponentProps, O[number]> & Record<string, unknown>
>

export type Context = Partial<ConfigurationProps>
