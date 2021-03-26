import { FC, ReactText, ComponentType } from 'react'
import { config } from '@vitus-labs/core'
import { extendCss, AlignContentAlignXKeys } from '@vitus-labs/unistyle'

type CreateValueType<T> = T | Record<string, T> | Array<T>

export type Obj = Record<string, unknown>
export type Value = ReactText
export type Css = Parameters<typeof extendCss>[0]
export type ExtraStyles = Css | Record<string, Css> | Array<Css>
export type CssOutput = ReturnType<typeof config.css> | string | any

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
  colCss: ExtraStyles
  rowCss: ExtraStyles
  colComponent: ComponentType
  rowComponent: ComponentType
  contentAlignX: ContentAlignX
  containerWidth: ContainerWidth
  width:
    | ContainerWidth
    | ((widths: Record<string, ReactText>) => Record<string, ReactText>)
}>

export type ComponentProps = ConfigurationProps &
  Partial<{
    component: ComponentType
    css: ExtraStyles
  }>

export type StyledTypes = Partial<{
  size: number
  padding: number
  gap: number
  gutter: number
  columns: number
  extraStyles: Css
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
