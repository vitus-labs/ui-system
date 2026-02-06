import type { config } from '@vitus-labs/core'
import type { MergeTypes } from './utils'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type StylesDefault = {}

export type Styles<S> = S extends unknown
  ? StylesDefault
  : MergeTypes<[StylesDefault, S]>

export type Css = typeof config.css
export type Style = ReturnType<Css>
export type OptionStyles = ((css: Css) => ReturnType<Css>)[]

export type StylesCb = (css: Css) => ReturnType<Css>
export type StylesCbArray = StylesCb[]
