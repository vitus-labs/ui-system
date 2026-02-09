import type { TProvider } from '~/context/context'
import Provider, { context } from '~/context/context'
import type { Rocketstyle } from '~/init'
import rocketstyle from '~/init'
import type { IsRocketComponent } from '~/isRocketComponent'
import isRocketComponent from '~/isRocketComponent'
import type { AttrsCb } from '~/types/attrs'
import type {
  ConfigAttrs,
  ConsumerCb,
  ConsumerCtxCBValue,
  ConsumerCtxCb,
  RocketComponentType,
  RocketProviderState,
} from '~/types/config'
import type { DefaultProps } from '~/types/configuration'
import type {
  DimensionCallbackParam,
  DimensionProps,
  Dimensions,
  DimensionValue,
  ExtractDimensionProps,
  ExtractDimensions,
  TDKP,
} from '~/types/dimensions'
import type { ComposeParam, GenericHoc } from '~/types/hoc'
import type {
  IRocketStyleComponent,
  RocketStyleComponent,
} from '~/types/rocketstyle'
import type { StylesCb, StylesDefault } from '~/types/styles'
import type {
  ThemeCb,
  ThemeDefault,
  ThemeMode,
  ThemeModeCallback,
  ThemeModeKeys,
} from '~/types/theme'
import type { ElementType, ExtractProps, MergeTypes, TObj } from '~/types/utils'

export type {
  StylesDefault,
  ThemeDefault,
  RocketStyleComponent,
  IRocketStyleComponent,
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
  ExtractDimensions,
  StylesCb,
  ConfigAttrs,
  AttrsCb,
  ThemeCb,
  ThemeModeCallback,
  ThemeModeKeys,
  GenericHoc,
  ComposeParam,
  DefaultProps,
  IsRocketComponent,
  ThemeMode,
}

export { rocketstyle, context, Provider, isRocketComponent }
export default rocketstyle
