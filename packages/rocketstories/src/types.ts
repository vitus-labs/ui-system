import type { ComponentType } from 'react'

export type Element = ComponentType
export type RocketComponent = ComponentType & { IS_ROCKETSTYLE: true }
export type Configuration = {
  attrs: Record<string, unknown>
  name: string
  component: Element
}

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
