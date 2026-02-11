import type { config } from '@vitus-labs/core'
import type { PseudoState } from './pseudo'
import type { MergeTypes, TObj } from './utils'

// biome-ignore lint/suspicious/noEmptyInterface: this is an interface to be extended in consuming projects
export interface StylesDefault {}

export type Styles<S> = S extends unknown
  ? StylesDefault
  : MergeTypes<[StylesDefault, S]>

export type Css = typeof config.css
export type Style = ReturnType<Css>
export type OptionStyles = ((css: Css) => ReturnType<Css>)[]

/**
 * Props available inside `.styles()` interpolation functions.
 *
 * - `$rocketstyle` — computed theme (inferred from `.theme()` chain)
 * - `$rocketstate` — active dimension values + pseudo state
 */
export type RocketStyleInterpolationProps<CSS extends TObj = TObj> = {
  $rocketstyle: CSS
  $rocketstate: Record<string, string | string[]> & {
    pseudo: Partial<PseudoState>
  }
} & Record<string, any>

/**
 * A tagged-template css function whose interpolation functions
 * receive typed props including `$rocketstyle` and `$rocketstate`.
 *
 * When used via `.styles()`, `CSS` is inferred from the chain's
 * accumulated `.theme()` calls, so both props are typed automatically.
 */
export type RocketCss<CSS extends TObj = TObj> = (
  strings: TemplateStringsArray,
  ...values: Array<
    | string
    | number
    | boolean
    | null
    | undefined
    | ((props: RocketStyleInterpolationProps<CSS>) => any)
    | any[]
  >
) => any

export type StylesCb<CSS extends TObj = TObj> = (
  css: RocketCss<CSS>,
) => ReturnType<Css>
export type StylesCbArray = StylesCb[]
