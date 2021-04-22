import type { ComponentType, ExoticComponent, VFC } from 'react'
import type { T_CONTROL_TYPES } from '~/constants/controls'

export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps

export type StoryComponent = VFC<any> & {
  args: any
  argTypes: any
  parameters: any
}

export type Element = ComponentType
export type RocketComponent = (ComponentType | ExoticComponent) & {
  IS_ROCKETSTYLE: true
  $$rocketstyle: Record<string, any>
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

export type Configuration<C = unknown> = {
  attrs: AttrsTypes<C>
  name: string
  component: Element | RocketComponent
}

export type SimpleValue = string | number | boolean
export type Obj = Record<string, SimpleValue | Array<SimpleValue>>

export type Controls = Record<string, Control>

export type PartialControls = Record<string, Partial<Control>>
