import rocketstyle, { Rocketstyle } from '~/init'
import Provider, { context, TProvider } from '~/context'
import isRocketComponent from '~/isRocketComponent'

import type {
  ConfigAttrs,
  RocketComponentType,
  RocketProviderState,
  ConsumerCtxCBValue,
  ConsumerCtxCb,
  ConsumerCb,
} from '~/types/config'
import type { TObj, ElementType, MergeTypes, ExtractProps } from '~/types/utils'
import type {
  Dimensions,
  DimensionValue,
  DimensionCallbackParam,
  ExtractDimensionProps,
  TDKP,
  DimensionProps,
} from '~/types/dimensions'
import type { StylesCb, StylesDefault } from '~/types/styles'
import type { AttrsCb } from '~/types/attrs'
import type { ThemeCb, ThemeModeKeys, ThemeDefault } from '~/types/theme'
import type { GenericHoc } from '~/types/hoc'
import type { DefaultProps } from '~/types/configuration'
import type { RocketComponent, IRocketComponent } from '~/types/rocketstyle'

export type {
  StylesDefault,
  ThemeDefault,
  RocketComponent,
  IRocketComponent,
  Rocketstyle,
  TProvider,
  RocketComponentType,
  RocketProviderState,
  ConsumerCtxCBValue,
  ConsumerCtxCb,
  ConsumerCb,
  TObj,
  ElementType,
  MergeTypes,
  ExtractProps,
  Dimensions,
  DimensionValue,
  DimensionCallbackParam,
  ExtractDimensionProps,
  TDKP,
  DimensionProps,
  StylesCb,
  ConfigAttrs,
  AttrsCb,
  ThemeCb,
  ThemeModeKeys,
  GenericHoc,
  DefaultProps,
}

export { context, Provider, isRocketComponent }
export default rocketstyle
