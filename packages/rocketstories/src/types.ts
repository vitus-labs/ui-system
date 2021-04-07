import type { ComponentType } from 'react'
import type { HTMLTags } from '@vitus-labs/core'
import type { ControlKeys } from '~/constants/controlTypes'

export type Element = ComponentType
export type RocketComponent = ComponentType & { IS_ROCKETSTYLE: true }
export type Configuration = {
  attrs: Record<string, unknown>
  name: string
  component: Element | RocketComponent
}

export type SimpleValue = string | number | boolean
export type Obj = Record<string, SimpleValue | Array<SimpleValue>>
export type Control = {
  type: ControlKeys
  options: Array<unknown> | Record<string, unknown>
  value: any
}

export type Controls = Record<string, Control>

export type PartialControls = Record<string, Partial<Control>>

type CTag = {
  type: 'tag'
  value?: HTMLTags
  options?: Array<HTMLTags>
}

type CBool = {
  type: 'boolean'
  value?: boolean
  options: never
}

type CText = {
  type: 'text' | 'color'
  value: string
  options: never
}

type CNumber = {
  type: 'number'
  value?: number
  options: never
}

type CSelect = {
  type: 'select'
  value?: Record<string, unknown>
  options: Array<Record<string, unknown>>
}

type CObject = {
  type: 'object'
  value?: Record<string, unknown>
  options: Record<string, unknown>
}

type CArray = {
  type: 'array'
  value?: Array<any>
  options: Array<any>
}

type CCheck = {
  type: 'radio' | 'inline-radio' | 'check' | 'inline-check'
  value?: string | number
  options?: Array<any>
}

export type AttrsControlsValue =
  | CCheck
  | CTag
  | CBool
  | CText
  | CObject
  | CSelect
  | CNumber
  | CObject
  | CArray
