import type { ComponentType, ForwardRefExoticComponent, VFC } from 'react'
import type { RocketComponentType } from '@vitus-labs/rocketstyle'
import type { T_CONTROL_TYPES } from '~/constants/controls'

export type TObj = Record<string, unknown>

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

export type StoryComponent = VFC<any> & {
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

export type TFn = (...args: any) => any
export type CallBackParam = TObj | TFn
export type DisplayName = string

export type ValueOf<T> = T[keyof T]

export type ArrayOfValues<T> = Array<T[keyof T]>

export type ArrayOfKeys<T> = Array<keyof T>

// eslint-disable-next-line @typescript-eslint/ban-types
export type SimpleHoc<P extends Record<string, unknown> = {}> = <
  T extends ComponentType<any>
>(
  WrappedComponent: T
) => VFC<MergeTypes<[P, ExtractProps<T>]>>

type IsFalseOrNullable<T> = T extends null | undefined | false ? never : true
export type NullableKeys<T> = { [K in keyof T]: IsFalseOrNullable<T[K]> }

type ExtractNullableKeys<T> = {
  [P in keyof T as T[P] extends null | never | undefined ? never : P]: T[P]
}

// merge types
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, keyof R>> & R
  // Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
  // Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
  // SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>

export type Spread<A extends readonly [...any]> = A extends [
  infer L,
  ...infer R
]
  ? SpreadTwo<L, Spread<R>>
  : unknown

export type MergeTypes<A extends readonly [...any]> = ExtractNullableKeys<
  Spread<A>
>
