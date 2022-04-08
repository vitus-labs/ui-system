import type { RocketComponentType } from '@vitus-labs/rocketstyle'
import type { ComponentType, VFC } from 'react'
import type { T_CONTROL_TYPES } from '~/constants/controls'

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

export type StoryComponent = VFC<any> & {
  args: any
  argTypes: any
  parameters: any
}

export type Element = ComponentType
export type RocketComponent = RocketComponentType & {
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

export type ExtractDimensions<C extends RocketComponent> =
  keyof C['$$rocketstyle']

export type Configuration<
  T extends Element | RocketComponent = Element | RocketComponent
> = {
  attrs: Record<string, any>
  name: string
  component: T
  storyOptions: Partial<{
    direction: 'inline' | 'rows'
    alignX: 'left' | 'center' | 'right' | 'spaceBetween'
    alignY: 'top' | 'center' | 'bottom' | 'spaceBetween'
    gap: number
    pseudo: true
  }>
  decorators: any[]
}

export type SimpleValue = string | number | boolean
export type Obj = Record<string, SimpleValue | Array<SimpleValue>>

export type Controls = Record<string, Control>

export type PartialControls = Record<string, Partial<Control>>
