import { FC, ReactText, ComponentType, HTMLProps } from 'react'
import { extendedCss } from '@vitus-labs/unistyle'

type CreateValueType<T> = T | Record<string, T> | Array<T>

export type Obj = Record<string, unknown>
export type Value = ReactText
export type Css = Parameters<typeof extendedCss>[0]
export type ExtendCss = Css | Record<string, Css> | Array<Css>

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
  width: ContainerWidth | ((widths: ContainerWidth) => ContainerWidth)
}>

export type ComponentProps = ConfigurationProps &
  Partial<{
    component: ComponentType
    css: ExtendCss
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
