import { TFn, ElementType, ArrayOfValues, ArrayOfKeys } from './utils'
import { Dimensions, MultiKeys, ExtractDimensionKey } from './dimensions'
import { PseudoProps } from './pseudo'
import { StylesCbArray } from './styles'
import { ConsumerCb } from './config'

export type __ROCKETSTYLE__ = {
  dimensions: Record<string, string>
  reservedPropNames: Record<string, true>
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}

export type OptionFunc = (...arg: Array<unknown>) => Record<string, unknown>

export type InitConfiguration<C, D> = {
  name?: string
  component: C
  useBooleans: boolean
  dimensions: D
  dimensionKeys: ArrayOfKeys<D>
  dimensionValues: ArrayOfValues<D>
  multiKeys: MultiKeys
}

export type Configuration<
  C = ElementType,
  D extends Dimensions = Dimensions
> = InitConfiguration<C, D> & {
  provider?: boolean
  consumer?: ConsumerCb
  DEBUG?: boolean
  inversed?: boolean
  passProps?: Array<string>
  styled?: boolean

  // array chaining options
  attrs: Array<OptionFunc>
  theme: Array<OptionFunc>
  styles: StylesCbArray
  compose: Record<string, TFn>
} & Record<ExtractDimensionKey<D[keyof D]>, any>

export type DefaultProps<
  C extends ElementType = ElementType,
  D extends Dimensions = Dimensions
> = Partial<PseudoProps>
