import type { ComponentType, ForwardRefExoticComponent, VFC } from 'react'
import type { RocketComponentType } from '@vitus-labs/rocketstyle'
import type { T_CONTROL_TYPES } from '~/constants/controls'

export type TObj = Record<string, unknown>

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

export type StoryComponent<P = {}> = VFC<P> & {
  args: any
  argTypes: any
  parameters: any
}

export type ElementType<T extends TObj | unknown = any> =
  | ComponentType<T>
  | ForwardRefExoticComponent<T>

export type RocketType = RocketComponentType & {
  VITUS_LABS__COMPONENT?: string
  getStaticDimensions: any
  getDefaultAttrs: any
  displayName?: string
}

export type ControlTypes = T_CONTROL_TYPES

export type Control = {
  type: T_CONTROL_TYPES
  value?: any
  valueType?: string
  description?: string
  group?: string
  options?: any[]
  disabled?: boolean
}

export type StorybookControl = {
  control: {
    type: string
  }
  defaultValue?: any
  description?: string
  options?: any[]
  table: {
    disabled?: boolean
    category?: string
    type: {
      summary?: string
    }
  }
}

export type AttrItemControl<T> = {
  type: T_CONTROL_TYPES
  value?: T
  options?: Record<string, any> | any[]
  group?: string
  description?: string
}

export type AttrsTypes<P, H = ExtractProps<P>> = {
  [I in keyof H]: H[I] | AttrItemControl<H[I]> | { disable: true }
}

export type ExtractDimensions<C extends RocketType> = keyof C['$$rocketstyle']

export type Configuration = {
  component: RocketType | ElementType
  attrs: Record<string, any>
  prefix?: string
  name: string
  storyOptions: Partial<{
    direction: 'inline' | 'rows'
    alignX: 'left' | 'center' | 'right' | 'spaceBetween'
    alignY: 'top' | 'center' | 'bottom' | 'spaceBetween'
    gap: number
    pseudo: boolean | null | undefined
  }>
  decorators: any[]
}

export type RocketStoryConfiguration = Configuration & {
  component: RocketType
}

export type StoryConfiguration = Configuration & {
  component: ElementType
}

export type SimpleValue = string | number | boolean
export type Obj = Record<string, SimpleValue | Array<SimpleValue>>

export type Controls = Record<string, Control>

export type PartialControls = Record<string, Partial<Control>>
