import type { ComponentType } from 'react'
import type { ControlKeys } from '~/constants/controlTypes'

export type Element = ComponentType
export type RocketComponent = ComponentType & { IS_ROCKETSTYLE: true }
export type Configuration = {
  attrs: Record<string, unknown>
  name: string
  component: Element | RocketComponent
}

export type SimpleValue = string | number | boolean
export type Obj = Record<string, string | number | boolean>
export type Control = {
  type: ControlKeys
  options: Array<unknown> | Record<string, unknown>
  value: any
}

export type Controls = Record<string, Control>

export type PartialControls = Record<string, Partial<Control>>

type Tag = {
  type: 'tag'
  value: string
  options: Array<string>
}

type Bool = {
  type: 'boolean'
  value: boolean
}

type Text = {
  type: 'text'
  value: string
}

type Object = {
  type: 'object'
  value: Record<string, unknown>
  options: Array<Record<string, unknown>>
}

export type Attrs = Tag | Bool | Text | Object
