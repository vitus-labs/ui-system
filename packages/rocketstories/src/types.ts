/* eslint-disable @typescript-eslint/ban-types */
import type {
  ComponentType,
  ForwardRefExoticComponent,
  ReactNode,
  VFC,
} from 'react'
import type { ListProps } from '@vitus-labs/elements'
import type { RocketComponentType } from '@vitus-labs/rocketstyle'
import type { T_CONTROL_TYPES } from '~/constants/controls'

export type TObj = Record<string, unknown>

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

export type StoryComponent<P = {}> = VFC<P> &
  Partial<{
    args: Record<string, unknown>
    argTypes: Record<string, unknown>
    parameters: Record<string, unknown>
  }>

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

export type ControlConfiguration = {
  type?: T_CONTROL_TYPES
  value?: any
  valueType?: string
  description?: string
  group?: string
  options?: any[]
  disable?: boolean
}

export type Control = ControlTypes | ControlConfiguration

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

export type ExtractDimensions<C extends RocketType> = keyof C['$$rocketstyle']

export type RocketDimensions = keyof RocketType['$$rocketstyle']

type Decorator = (Story: any) => ReactNode

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
  controls: Record<string, Control>
  decorators: Decorator[]
}

export type RocketStoryConfiguration = Omit<Configuration, 'component'> & {
  component: RocketType
}

export type StoryConfiguration = Omit<Configuration, 'component'> & {
  component: ElementType
}

export type SimpleValue = string | number | boolean
export type Obj = Record<string, SimpleValue | Array<SimpleValue>>

export type Controls = Record<string, Control>

export type PartialControls = Record<string, Partial<Control>>

export type RenderStoryCallback<P extends TObj = {}> = (
  param: (props: P) => ReactNode
) => VFC<P>

export type ListStoryOptions = Pick<
  ListProps,
  'itemKey' | 'itemProps' | 'wrapComponent' | 'wrapProps' | 'valueName'
> & {
  data: ListProps['data']
}
