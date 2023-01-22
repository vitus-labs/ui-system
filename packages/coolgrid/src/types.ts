import { FC, ReactNode, ComponentType } from 'react'
import { config, BreakpointKeys } from '@vitus-labs/core'
import { extendCss, AlignContentAlignXKeys } from '@vitus-labs/unistyle'

type CreateValueType<T> = T | Array<T> | Partial<Record<BreakpointKeys, T>>

export type Obj = Record<string, unknown>
export type Value = string | number
export type Css = Parameters<typeof extendCss>[0]
export type ExtraStyles = CreateValueType<Css>

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
  width: ContainerWidth | ((widths: Record<string, any>) => ContainerWidth)
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
  Omit<ComponentProps, O[number]> &
    Record<string, unknown> & { children?: ReactNode }
> & {
  pkgName: string
  VITUS_LABS__COMPONENT: string
}

export type Context = Partial<ConfigurationProps>
