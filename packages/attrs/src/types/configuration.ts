import type { TFn, ElementType } from './utils'

export type OptionFunc = (...arg: Array<unknown>) => Record<string, unknown>

export type InitConfiguration<C> = {
  name?: string
  component: C
}

export type Configuration<C = ElementType | unknown> = InitConfiguration<C> & {
  DEBUG?: boolean
  attrs: OptionFunc[]
  priorityAttrs: OptionFunc[]
  compose: Record<string, TFn | null | undefined | false>
  statics: Record<string, any>
} & Record<string, any>

export type ExtendedConfiguration<C = ElementType | unknown> =
  InitConfiguration<C> & {
    DEBUG?: boolean
    attrs: OptionFunc
    priorityAttrs: OptionFunc
    compose: Record<string, TFn | null | undefined | false>
    statics: Record<string, any>
  } & Record<string, any>
