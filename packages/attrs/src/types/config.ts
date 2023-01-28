import type { ElementType } from './utils'

// --------------------------------------------------------
// CONFIG
// --------------------------------------------------------
export type AttrsComponentType = ElementType & {
  IS_ATTRS: true
}

export type ConfigAttrs<C extends ElementType | unknown> = Partial<{
  name: string
  component: C
  DEBUG: boolean
}>
